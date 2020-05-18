import { Transform, MemberExpression } from "jscodeshift";

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const collections = root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      property: {
        type: 'Identifier',
        name: 'toJS',
      },
    },
  });

  collections.replaceWith((path) => (path.node.callee as MemberExpression).object);
  return root.toSource();
};

export default transform;
