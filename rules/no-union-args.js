const { createRule } = require("./utils");

module.exports = createRule({
  name: "no-undefined-union-in-args",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow unions with `undefined` in `@Args` decorator parameters.",
    },
    schema: [],
    messages: {
      noUndefinedUnion:
        "Avoid using `| undefined` in `@Args` decorator parameters.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TSUnionType(node) {
        if (
          node.types.some((t) => t.type === "TSUndefinedKeyword") &&
          context
            .getAncestors()
            .some(
              (ancestor) =>
                ancestor.type === "Decorator" &&
                ancestor.expression.type === "CallExpression" &&
                ancestor.expression.callee.type === "Identifier" &&
                ancestor.expression.callee.name === "Args",
            )
        ) {
          context.report({ node, messageId: "noUndefinedUnion" });
        }
      },
    };
  },
});
