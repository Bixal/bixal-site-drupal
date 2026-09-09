import { fileURLToPath } from "node:url";

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-links",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  docs: {},
  staticDirs: ["../stories/assets", "../node_modules/@uswds/uswds/dist"],
  async viteFinal(config) {
    // This allows starting this in a sub dir:
    // BASE_PATH=/sb npm run build-storybook
    config.base = process.env.BASE_PATH || config.base;

    // `locutus` is pinned to 3.x in the root `overrides` to clear the RCE and
    // prototype-pollution advisories in 2.x. `twig` 3.x is compatible with it;
    // `drupal-twig-extensions` (unmaintained at 1.0.0-beta.5) is not, so its
    // one locutus import is routed through a shim. Remove both once that
    // package publishes a locutus 3.x-compatible release.
    config.resolve = config.resolve || {};
    const existing = config.resolve.alias || [];
    config.resolve.alias = [
      {
        find: "locutus/php/datetime/date.js",
        replacement: fileURLToPath(
          new URL("./shims/locutus-php-date.js", import.meta.url),
        ),
      },
      ...(Array.isArray(existing)
        ? existing
        : Object.entries(existing).map(([find, replacement]) => ({
            find,
            replacement,
          }))),
    ];

    // return the customized config
    return config;
  },
};
export default config;
