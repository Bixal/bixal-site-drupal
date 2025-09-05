/** @type { import('stylelint').Config } */
export default {
  extends: ["stylelint-config-standard-scss", "stylelint-prettier/recommended"],
  rules: {
    "custom-property-pattern": null, // Allows us to set private CSS vars.
    "selector-class-pattern": null, // Disabled because we use BEM.
  },
};
