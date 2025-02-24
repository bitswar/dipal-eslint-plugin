const noUnionArgs = require("./rules/no-union-args");
const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: { "no-union-args": noUnionArgs },
};
module.exports = plugin;
