const { RuleTester } = require("@typescript-eslint/rule-tester");
const mocha = require("mocha");
const rule = require("../rules/no-union-args");

RuleTester.afterAll = mocha.after;

const ruleTester = new RuleTester();

ruleTester.run("no-union-args", rule, {
  valid: [
    {
      code: `
        class Test {
          @Args("pagination", { type: () => PaginationInput, nullable: true })
          pagination?: PaginationInput;
        }
      `,
      filename: "test.ts",
    },
  ],
  invalid: [
    {
      code: `
        class Test {
          @Args("pagination", { type: () => PaginationInput, nullable: true })
          pagination?: PaginationInput | undefined;
        }
      `,
      filename: "test.ts",
      errors: [{ messageId: "noUndefinedUnion" }],
    },
  ],
});
