const globby = require('globby');
const inquirer = require('inquirer');
const meow = require('meow');
const path = require('path');
const execa = require('execa');

const checkGitStatus = require('./checkGitStatus');
const codemodsHelp = require('./help');
const { TRANSFORMER_INQUIRER_CHOICES } = require('../transforms');

const transformsDirectory = path.join(__dirname, '..', 'transforms');
const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');

const logger = console;

function runTransform({ files, flags, parser = 'babel', transformer }) {
  const transformerPath = path.join(transformsDirectory, `${transformer}.ts`);

  let args = [];

  const { dry, print } = flags;

  if (dry) {
    args.push('--dry');
  }

  if (print) {
    args.push('--print');
  }

  args.push('--verbose=2');
  args.push('--ignore-pattern=**/node_modules/**');
  args.push('--parser', parser);
  args.push('--extensions=jsx,js');

  args = args.concat(['--transform', transformerPath]);

  if (flags.jscodeshift) {
    args = args.concat(flags.jscodeshift);
  }

  args = args.concat(files);

  logger.log(`Executing command: jscodeshift ${args.join(' ')}`);

  const result = execa.sync(jscodeshiftExecutable, args, {
    stdio: 'inherit',
    stripEof: false,
  });

  if (result.error) {
    throw result.error;
  }
}

function expandFilePathsIfNeeded(filesBeforeExpansion) {
  const shouldExpandFiles = filesBeforeExpansion.some((file) => file.includes('*'));
  return shouldExpandFiles ? globby.sync(filesBeforeExpansion) : filesBeforeExpansion;
}

function run() {
  const cli = meow(
    {
      description: 'Codemods to replace ImmutableJS library with ES6.',
      help: codemodsHelp,
    },
    {
      boolean: ['force', 'dry', 'print', 'help'],
      string: ['_'],
      alias: {
        h: 'help',
      },
    }
  );

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'files',
        message: 'On which files or directory should the codemods be applied?',
        when: !cli.input[0],
        default: '.',
        filter: (files) => files.trim(),
      },
      {
        type: 'list',
        name: 'transformer',
        message: 'Which transform would you like to apply?',
        when: !cli.input[1],
        pageSize: TRANSFORMER_INQUIRER_CHOICES.length,
        choices: TRANSFORMER_INQUIRER_CHOICES,
      },
    ])
    .then((answers) => {
      const { files, transformer, parser } = answers;

      const filesBeforeExpansion = cli.input[0] || files;
      const filesExpanded = expandFilePathsIfNeeded([filesBeforeExpansion]);

      const selectedTransformer = cli.input[1] || transformer;
      const selectedParser = cli.flags.parser || parser;

      if (!filesExpanded.length) {
        logger.log(
          `No files found matching ${filesBeforeExpansion.join(' ')}`
        );
        return null;
      }

      if (!cli.flags.dry) {
        checkGitStatus(cli.flags.force, filesBeforeExpansion);
      }

      return runTransform({
        files: filesExpanded,
        flags: cli.flags,
        parser: selectedParser,
        transformer: selectedTransformer,
        answers,
      });
    });
}

module.exports = {
  run,
  runTransform,
  checkGitStatus,
  jscodeshiftExecutable,
  transformsDirectory,
};
