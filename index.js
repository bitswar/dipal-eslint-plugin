const noUnionArgs = require("./rules/no-union-args");
const pkg = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: { "no-union-args": noUnionArgs },
};
module.exports = plugin;
