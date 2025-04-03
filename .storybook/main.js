/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../stories/assets", "../node_modules/@uswds/uswds/dist"],
  async viteFinal(config, { configType }) {
    // This allows starting this in a sub dir:
    // BASE_PATH=/sb npm run build-storybook
    config.base = process.env.BASE_PATH || config.base;
    // return the customized config
    return config;
  },
};
export default config;
