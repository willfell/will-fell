module.exports = {
  extends: [
    "next",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jsdoc/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["unused-imports", "simple-import-sort", "jsdoc"],
  rules: {
    // Automatically remove unused imports
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
    // Auto-sort imports
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    // JSDoc rules for comments cleanup
    "jsdoc/check-alignment": "warn",
    "jsdoc/check-indentation": "warn",
    "jsdoc/no-undefined-types": "warn",
  },
};
