import { Transform, CallExpression, ASTPath, JSCodeshift, MemberExpression } from "jscodeshift";

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

    const argument = this.path.node.arguments[0];
    let newArgument: any = argument;
    let computed = true;

    if (argument.type === 'Literal') {
      newArgument = this.j.identifier(argument.value + '');
      computed = false;
    }

    const memberExpression = this.path.node.callee as MemberExpression;
    const newMemberExpression = this.j.memberExpression(
      memberExpression.object,
      newArgument,
      computed,
    );

    const defaultExpression = this.path.node.arguments[1] as any;
    this.path.replace(
      this.j.assignmentExpression(
        '=',
        newMemberExpression,
        defaultExpression,
      )
    )
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
        name: "set"
      }
    }
  });

  let collections = find();
  collections.forEach((path) => new Handler(j, path).transform());

  return root.toSource();
};

export default transform;

