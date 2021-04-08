import { Transform, ASTNode, ASTPath, CallExpression, NewExpression } from "jscodeshift";

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const toTransformer = (defaultValue: ASTNode) => (node: ASTPath<CallExpression | NewExpression>) => {
    node.replace(node.value.arguments[0] || defaultValue);
  }

  const arrayTransform = toTransformer(j.arrayExpression([]));
  const objectTransform = toTransformer(j.objectExpression([]));

  [
    { name: 'List', transform: arrayTransform },
    { name: 'Set', transform: arrayTransform },
    { name: 'Map', transform: objectTransform },
  ].forEach(({ name, transform }) => {
    const filter = {
      callee: {
        type: "Identifier",
        name
      }
    };
    root.find(j.CallExpression, filter).forEach(transform);
    root.find(j.NewExpression, filter).forEach(transform);
  });

  return root.toSource();
};

export default transform;
