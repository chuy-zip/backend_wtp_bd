import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,  // Keep browser globals if needed
        process: "readonly",  // Allow process to be used as a global in Node.js
      },
    },
    rules: {
      "no-unused-vars": "off", // Disable the unused vars rule
    },
  },
  pluginJs.configs.recommended,
];
