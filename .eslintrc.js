module.exports = {
  extends: ["eslint:recommended", "prettier"],
  env: {
    es6: true,
    node: true,
    es2020: true,
    jest: true,
  },
  parser: "espree",
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    camelcase: 0,
  },
};
