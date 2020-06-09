import { Transform, CallExpression, ObjectExpression, Property } from "jscodeshift";

const hasValidArguments = (callExpression: CallExpression) => {
  return callExpression.arguments.length === 1
    && callExpression.arguments[0] && callExpression.arguments[0].type === 'ObjectExpression';
};

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const collections = root.find(j.CallExpression, {
    callee: {
      type: 'Identifier',
      name: 'fromJS',
    },
  });

  collections.forEach((path) => {
    if (hasValidArguments(path.node)) {
      const objectExpression = path.node.arguments[0] as ObjectExpression;

      objectExpression.properties.forEach((p) => {
        const property = p as Property;

        if (property.value.type === 'Literal') {
          const literal = property.value as any;

          if (literal.raw) {
            return;
          }
        }

        property.value = j.callExpression(
          j.identifier('fromJS'),
          [property.value as any],
        )
      });

      path.replace(objectExpression);
    }
  });

  return root.toSource();
};

export default transform;
