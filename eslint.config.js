import { defineConfig } from "eslint/config";
import eslintRecommended from "@eslint/js"; // Recommended base JS config.
import globals from "globals"; // Standard globals sets, like browser and node globals.
import eslintConfigPrettier from "eslint-config-prettier"; // Disables rules that conflict with Prettier.

export default defineConfig([
  // Global ignore patterns.
  {
    ignores: [
      "orch/**", // orchestration scripts
      "web/core/**", // Drupal core
      "web/libraries/**", // Third-party FE libs
      "**/modules/contrib/**", // Contrib modules anywhere
      "**/themes/contrib/**", // Contrib themes
      "**/dist/**", // Build outputs
      "**/vendor/**", // Composer vendor
      "**/storybook-static/**", // Static Storybook export
      "node_modules/**", // Node dependencies
    ],
  },
  // Browser-focused JS used in stories and theme.
  {
    files: ["stories/**/*.js", "web/themes/custom/bixal_uswds/src/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        Drupal: "readonly",
        drupalSettings: "readonly",
        once: "readonly",
        context: "readonly",
      },
    },
    extends: [eslintRecommended.configs.recommended, eslintConfigPrettier],
    rules: {
      // Warn on Drupal "settings", but don't error.
      "no-unused-vars": ["warn", { varsIgnorePattern: "^settings$" }],
    },
  },
  // Node & tooling config files.
  {
    files: [
      "*.config.js",
      "*.config.mjs",
      ".storybook/**/*.js",
      "vite.config.*",
      "**/gulpfile.js",
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
    extends: [eslintRecommended.configs.recommended, eslintConfigPrettier],
    rules: {
      "no-console": "off", // Disable logs so we can debug build scripts.
    },
  },
]);
