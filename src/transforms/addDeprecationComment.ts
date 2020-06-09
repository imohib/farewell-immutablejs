import { Transform } from "jscodeshift";

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;

  const root = j(file.source);
  const immutableImports = root.find(j.ImportDeclaration, {
    source: {
      value: 'immutable'
    }
  });

  if (immutableImports.length > 0) {
    const deprecationMessage = [
      j.commentLine(' ImmutableJS usage is deprecated', true, false),
      j.commentLine(' Please, do not copy & paste or use this snippet as reference :)', true, false),
      j.commentLine(' How to refactor? See https://github.com/quintoandar/farewell-immutablejs/blob/master/MIGRATION.md', true, false),
    ]

    // Attach message before first Immutable import
    immutableImports.at(0).forEach((p) => {
      const comments = p.node.comments = p.node.comments || [];
      comments.push(...deprecationMessage);
    });
  }

  return root.toSource();
};

export default transform;
