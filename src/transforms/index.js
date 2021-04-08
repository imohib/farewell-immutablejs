exports.TRANSFORMER_INQUIRER_CHOICES = [
  {
    name: 'Remove ImmutableJS imports.',
    value: 'removeImport',
  },
  {
    name: 'Remove fromJS() calls.',
    value: 'removeFromJS',
  },
  {
    name: 'Remove toJS() calls.',
    value: 'removeToJS',
  },
  {
    name: 'Replace get() calls.',
    value: 'replaceGet',
  },
  {
    name: 'Replace getIn() calls with a safe optional chainning and null coalescing operation.',
    value: 'replaceGetIn',
  },
  {
    name: 'Replace set() calls.',
    value: 'replaceSet',
  },
  {
    name: 'Replace setIn() calls.',
    value: 'replaceSetIn',
  },
  {
    name: 'Replace merge() calls.',
    value: 'replaceMerge',
  },
  {
    name: 'Nest FromJS.',
    value: 'nestFromJS',
  },
  {
    name: 'Add deprecation comment.',
    value: 'addDeprecationComment',
  },
  {
    name: 'Replace constructors.',
    value: 'replaceConstructors',
  },
];
