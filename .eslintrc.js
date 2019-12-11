module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:promise/recommended"
  ],
  parserOptions: {
    ecmaVersion: 7,
    sourceType: "module"
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true
  },
  rules: {
    "no-console": 0
  },
  plugins: ["promise"],
  extends: ["eslint:recommended"],
  parser: "babel-eslint"
};
