import "./docs.css";
import "../stories/assets/styles/global/global.scss";

/** @type { import('@storybook/html').Preview } */
const preview = {
  parameters: {
    a11y: {
      context: "body.sb-show-main",
      options: {
        runOnly: ["wcag21aa", "section508", "best-practice"],
      },
    },
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
          "Welcome",
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
