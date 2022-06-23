import { Transform, CallExpression, ASTPath, JSCodeshift, MemberExpression, Literal } from "jscodeshift";

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

    if (node.arguments.length !== 2) {
      return false;
    }

    const firstArg = node.arguments[0];

    if (!(firstArg.type === 'Literal' || firstArg.type === 'StringLiteral') && firstArg.type !== 'Identifier') {
      return false;
    }

    return true;
  }

  transform() {
    if (!this.argumentsMatch) {
      return;
    }

    const propertyName = this.path.node.arguments[0] as Literal;
    const propertyValue = this.path.node.arguments[1] as any;
    const baseObject = (this.path.node.callee as MemberExpression).object;

    this.path.replace(
      this.j.objectExpression([
        this.j.spreadElement(baseObject),
        this.j.objectProperty(
          propertyName,
          propertyValue
        ),
      ])
    )
  }
}

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const find = () => root.find(j.CallExpression, (p) => {
    const callee = p.callee;

    return (callee.type === 'MemberExpression' || callee.type === 'OptionalMemberExpression') &&
      callee.property.type === 'Identifier' &&
      callee.property.name === 'set';
  });

  let collections = find();
  collections.forEach((path) => new Handler(j, path).transform());

  return root.toSource();
};

export default transform;

