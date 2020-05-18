import { Transform } from "jscodeshift";

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const collections = root.find(j.ImportDeclaration, {
    source: {
      value: 'immutable'
    }
  });

  collections.remove()
  return root.toSource();
};

export default transform;
