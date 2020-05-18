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

    this.path.replace(
      this.j.objectExpression([
        this.j.spreadElement(baseObject),
        this.j.spreadElement(argument),
      ])
    )
  }
}

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const collections = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      property: {
        type: "Identifier",
        name: "merge"
      }
    }
  });

  collections.forEach((path) => new Handler(j, path).transform());

  return root.toSource();
};

export default transform;

