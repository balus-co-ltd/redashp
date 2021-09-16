module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: ["./tsconfig.json"], // relative path from extended eslintrc
  },
  plugins: ["@typescript-eslint", "import", "unused-imports"],
  rules: {
    eqeqeq: "error",
    "no-cond-assign": ["error", "always"],
    // "import/order": "off", // vscode auto import conflicts with import/order
    "import/no-unresolved": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "no-confusing-arrow": "error",
    "object-shorthand": "error",
    "prefer-object-spread": "error",
    // "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off", // https://github.com/typescript-eslint/typescript-eslint/issues/1423#issuecomment-574744252
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/promise-function-async": "error",
  },
};
