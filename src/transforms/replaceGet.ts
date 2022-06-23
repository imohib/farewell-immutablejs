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

    if (
        argument.type === 'Literal' ||
        argument.type === 'StringLiteral' ||
        argument.type === 'NumericLiteral'
    ) {
      const isNumericLiteral = argument.type === 'NumericLiteral' ||
        argument.value !== null && !isNaN(+argument.value);

      newArgument = this.j.identifier(argument.value + '');
      computed = isNumericLiteral;
    }

    const memberExpression = this.path.node.callee as MemberExpression;
    const optionalMemberExpression = this.j.optionalMemberExpression(
      memberExpression.object,
      newArgument,
      computed,
    );

    if (this.hasDefault) {
      const defaultExpression = this.path.node.arguments[1] as any;
      const isPartOfLogicalExpression = this.path.name === 'left' || this.path.name === 'right';
      const logicalExpression = this.j.logicalExpression(
        '??',
        optionalMemberExpression,
        defaultExpression,
      );

      this.path.replace(isPartOfLogicalExpression ? this.j.parenthesizedExpression(logicalExpression) : logicalExpression);
    } else {
      this.path.replace(optionalMemberExpression);
    }
  }
}

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const find = () => root.find(j.CallExpression, (p) => {
    const callee = p.callee;

    return (callee.type === 'MemberExpression' || callee.type === 'OptionalMemberExpression') &&
      callee.property.type === 'Identifier' &&
      callee.property.name === 'get';
  });

  let collections = find();
  collections.forEach((path) => new Handler(j, path).transform());

  return root.toSource();
};

export default transform;

