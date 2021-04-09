import { Transform, Identifier } from "jscodeshift";

const IMMUTABLE_STRUCTURES = ['Map', 'List', 'Set'];
const JS_STRUCTURES: { [k: string]: string } = {
  'Map': 'object',
  'List': 'array',
  'Set': 'array',
}

function isIdentifier(n: any): n is Identifier {
  return !!n.name;
}

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const collection = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      property: {
        type: "Identifier",
        name: "instanceOf"
      }
    }
  });
  collection.forEach(n => {
    if (n.node.arguments.length === 1) {
      const arg = n.node.arguments[0];
      if (isIdentifier(arg)) {
        const { name } = arg;
        if (IMMUTABLE_STRUCTURES.includes(name)) {
          n.replace(j.memberExpression(j.identifier('PropTypes'), j.identifier(JS_STRUCTURES[name])));
        }
      }
    }
  });

  return root.toSource();
};

export default transform;
