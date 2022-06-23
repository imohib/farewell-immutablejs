import { Transform, CallExpression, ASTPath, JSCodeshift, MemberExpression, ObjectExpression } from "jscodeshift";

class Handler {
  private j: JSCodeshift;
  private path: ASTPath<CallExpression>;
  private argumentsMatch: boolean;

  constructor(j: JSCodeshift, path: ASTPath<CallExpression>) {
    this.j = j;
    this.path = path;
    this.argumentsMatch = this.checkArgumentContract();
  }

  checkArgumentContract() {
    const node = this.path.node;

    if (node.arguments.length !== 1) {
      return false;
    }

    return true;
  }

  transform() {
    if (!this.argumentsMatch) {
      return;
    }

    const baseObject = (this.path.node.callee as MemberExpression).object;
    const argument = this.path.node.arguments[0] as any;
    let newArgument: any[] = [this.j.spreadElement(argument)];

    if (argument.type === 'ObjectExpression') {
      const objectArgument = argument as ObjectExpression;

      newArgument = [...objectArgument.properties];
    }

    this.path.replace(
      this.j.objectExpression([
        this.j.spreadElement(baseObject),
        ...newArgument,
      ])
    )

  }
}

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const collections = root.find(j.CallExpression, (p) => {
    const callee = p.callee;

    return (callee.type === 'MemberExpression' || callee.type === 'OptionalMemberExpression') &&
      callee.property.type === 'Identifier' &&
      callee.property.name === 'merge';
  });

  collections.forEach((path) => new Handler(j, path).transform());

  return root.toSource();
};

export default transform;

