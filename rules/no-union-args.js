const { createRule } = require("./utils");

module.exports = createRule({
  name: "no-union-args",
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
        if (node.types.some((t) => t.type === "TSUndefinedKeyword")) {
          const parent = node.parent; // usually the TSTypeAnnotation node
          const classProp = parent && parent.parent; // the class property
          if (
            classProp &&
            Array.isArray(classProp.decorators) &&
            classProp.decorators.some(
              (decorator) =>
                decorator.expression &&
                decorator.expression.type === "CallExpression" &&
                decorator.expression.callee.name === "Args",
            )
          ) {
            context.report({ node, messageId: "noUndefinedUnion" });
          }
        }
      },
    };
  },
});
