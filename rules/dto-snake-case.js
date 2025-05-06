const { ESLintUtils } = require("@typescript-eslint/utils");

const createRule = ESLintUtils.RuleCreator(
  (ruleName) => `https://example.com/rule/${ruleName}`,
);

module.exports = createRule({
  name: "dto-snake-case",
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure class properties in .dto.ts files are named in snake_case",
      recommended: "error",
    },
    schema: [],
    messages: {
      invalidPropertyName:
        'Property "{{name}}" in .dto.ts file must be in snake_case.',
    },
  },
  defaultOptions: [],
  create(context) {
    // Проверяем, что файл заканчивается на .dto.ts
    if (!context.filename().endsWith(".dto.ts")) {
      return {};
    }

    return {
      // Проверяем свойства класса
      PropertyDefinition(node) {
        const propertyName = node.key.name;
        if (!propertyName) return;

        // Проверяем, что имя в snake_case (только буквы, цифры, подчеркивания, без заглавных букв)
        const isSnakeCase = /^[a-z0-9_]+$/.test(propertyName);

        if (!isSnakeCase) {
          context.report({
            node: node.key,
            messageId: "invalidPropertyName",
            data: { name: propertyName },
          });
        }
      },
    };
  },
});
