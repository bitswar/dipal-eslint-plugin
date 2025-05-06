const { ESLintUtils } = require("@typescript-eslint/utils");

const createRule = ESLintUtils.RuleCreator(
  (ruleName) => `https://example.com/rule/${ruleName}`,
);

module.exports = createRule({
  name: "dto-optional-decorator",
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure optional properties in .dto.ts files have @IsOptional decorator",
      recommended: "error",
    },
    schema: [],
    messages: {
      missingIsOptional:
        'Optional property "{{name}}" in .dto.ts file must have @IsOptional decorator.',
    },
  },
  defaultOptions: [],
  create(context) {
    // Проверяем, что файл заканчивается на .dto.ts
    if (!context.filename.endsWith(".dto.ts")) {
      return {};
    }

    return {
      // Проверяем свойства класса
      PropertyDefinition(node) {
        // Проверяем, является ли поле опциональным (наличие ? в типе)
        const isOptional =
          node.optional ||
          (node.typeAnnotation &&
            node.typeAnnotation.typeAnnotation.type === "TSUndefinedKeyword");

        if (!isOptional) return;

        const propertyName = node.key.name;
        if (!propertyName) return;

        // Проверяем декораторы
        const hasIsOptionalDecorator = node.decorators?.some(
          (decorator) =>
            decorator.expression.type === "CallExpression" &&
            decorator.expression.callee.name === "IsOptional",
        );

        if (!hasIsOptionalDecorator) {
          context.report({
            node: node.key,
            messageId: "missingIsOptional",
            data: { name: propertyName },
          });
        }
      },
    };
  },
});
