const { ESLintUtils } = require("@typescript-eslint/utils");

const createRule = ESLintUtils.RuleCreator(
  (ruleName) => `https://example.com/rule/${ruleName}`,
);

module.exports = createRule({
  name: "no-uuid-objectid-compare",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow comparing UUID or ObjectID using == or ===; use .equals() instead",
      recommended: "error",
    },
    schema: [],
    messages: {
      invalidComparison:
        "Comparing {{left}} with {{right}} using {{operator}} is incorrect. Use .equals() instead.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      // Проверяем бинарные выражения (==, ===)
      BinaryExpression(node) {
        const { operator, left, right } = node;

        // Проверяем только == или ===
        if (operator !== "==" && operator !== "===") {
          return;
        }

        // Получаем типы операндов через TypeScript (если доступно)
        const checker = context.parserServices?.program?.getTypeChecker();
        if (!checker) {
          return; // Требуется TypeScript для анализа типов
        }

        // Получаем узлы для левого и правого операнда
        const leftNode =
          context.parserServices.esTreeNodeToTSNodeMap?.get(left);
        const rightNode =
          context.parserServices.esTreeNodeToTSNodeMap?.get(right);

        if (!leftNode || !rightNode) {
          return;
        }

        // Получаем типы
        const leftType = checker.getTypeAtLocation(leftNode);
        const rightType = checker.getTypeAtLocation(rightNode);

        // Проверяем, являются ли типы UUID или ObjectID (по имени типа или сигнатуре)
        const isUuidOrObjectId = (type) => {
          const typeName = checker.typeToString(type);
          return (
            typeName.includes("UUID") ||
            typeName.includes("ObjectId") ||
            typeName.includes("ObjectID") ||
            // Можно добавить другие специфичные типы, если используются
            typeName.includes("MongoId")
          );
        };

        // Проверяем, являются ли операнды UUID или ObjectID
        const leftIsUuidOrObjectId = isUuidOrObjectId(leftType);
        const rightIsUuidOrObjectId = isUuidOrObjectId(rightType);

        if (leftIsUuidOrObjectId || rightIsUuidOrObjectId) {
          context.report({
            node,
            messageId: "invalidComparison",
            data: {
              left: left.name || "left operand",
              right: right.name || "right operand",
              operator,
            },
          });
        }
      },
    };
  },
});
