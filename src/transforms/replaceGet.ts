import { Transform, CallExpression, ASTPath, JSCodeshift, MemberExpression } from "jscodeshift";

class Handler {
  private j: JSCodeshift;
  private path: ASTPath<CallExpression>;
  private argumentsMatch: boolean;
  private hasDefault!: boolean;

  constructor(j: JSCodeshift, path: ASTPath<CallExpression>) {
    this.j = j;
    this.path = path;
    this.argumentsMatch = this.checkArgumentContract();
  }

  checkArgumentContract() {
    const node = this.path.node;

    // skip enzyme calls
    if (node.arguments.some(a => a.type === 'NumericLiteral')) {
      return false;
    }

    if (node.arguments.length == 0 || node.arguments.length > 2) {
      return false;
    }

    this.hasDefault = node.arguments.length === 2;

    return true;
  }

  transform() {
    if (!this.argumentsMatch) {
      return;
    }

    const argument = this.path.node.arguments[0];
    let newArgument: any = argument;
    let computed = true;

    if (argument.type === 'Literal' || argument.type === 'StringLiteral') {
      newArgument = this.j.identifier(argument.value + '');
      computed = false;
    }

    const memberExpression = this.path.node.callee as MemberExpression;
    const optionalMemberExpression = this.j.optionalMemberExpression(
      memberExpression.object,
      newArgument,
      computed,
    );

    if (this.hasDefault) {
      const defaultExpression = this.path.node.arguments[1] as any;

      this.path.replace(
        this.j.logicalExpression(
          '??',
          optionalMemberExpression,
          defaultExpression,
        )
      )
    } else {
      this.path.replace(optionalMemberExpression)
    }
  }
}

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const find = () => root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      property: {
        type: "Identifier",
        name: "get"
      }
    }
  });

  let collections = find();
  collections.forEach((path) => new Handler(j, path).transform());

  return root.toSource();
};

export default transform;

