const { ESLintUtils } = require("@typescript-eslint/utils");

module.exports = {
  createRule: ESLintUtils.RuleCreator(
    (name) => `https://example.com/rule/${name}`,
  ),
};
