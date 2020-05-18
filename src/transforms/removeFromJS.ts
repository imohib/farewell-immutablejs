import { Transform, CallExpression } from "jscodeshift";

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const collections = root.find(j.CallExpression, {
    callee: {
      type: 'Identifier',
      name: 'fromJS',
    },
  });

  collections.replaceWith((path) => (path.node as CallExpression).arguments);
  return root.toSource();
};

export default transform;
