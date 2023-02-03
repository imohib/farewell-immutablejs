import { Transform, Identifier } from "jscodeshift";

const IMMUTABLE_STRUCTURES = ['Map', 'List', 'Set'];

function isIdentifier(n: any): n is Identifier {
  return !!n.name;
}

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  // first get rid of the export type
  const typeExports = root.find(j.ExportNamedDeclaration);
  typeExports.forEach(n => {
    if (n.node.declaration?.type === 'TSTypeAliasDeclaration') {
      if (
        n.node.declaration.typeAnnotation.type === 'TSTypeReference' &&
        isIdentifier(n.node.declaration.typeAnnotation.typeName) &&
        IMMUTABLE_STRUCTURES.includes(n.node.declaration.typeAnnotation.typeName.name) &&
        n.node.declaration.typeAnnotation.typeParameters?.params[0]
      ) {
        const genericParamAnnotation = n.node.declaration.typeAnnotation.typeParameters.params[0];
        const typeAliasDeclaration = j.tsTypeAliasDeclaration(
          n.node.declaration.id,
          n.node.declaration.typeAnnotation.typeName.name === 'Map'
            ? genericParamAnnotation
            : j.tsArrayType(genericParamAnnotation)
        );

        n.replace(j.exportNamedDeclaration(typeAliasDeclaration));
      }
    }
  });

  // then fix normal types
  const collection = root.find(j.TSTypeReference);
  collection.forEach(n => {
    if (isIdentifier(n.node.typeName) && IMMUTABLE_STRUCTURES.includes(n.node.typeName.name) && n.node.typeParameters?.params[0]) {
      const typeNode = n.node.typeName.name === 'Map'
        ? n.node.typeParameters.params[0]
        : j.tsArrayType(n.node.typeParameters.params[0]);

      n.replace(typeNode);
    }
  });

  return root.toSource();
};

export default transform;
