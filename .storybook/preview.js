import "./docs.css";
import "../stories/assets/styles/global/global.scss";

/** @type { import('@storybook/html').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Components",
          ["Example Component", "Form", "Typography", "*"],
          "Pages",
          ["Base"],
          "*",
        ],
      },
    },
  },
};

export default preview;
