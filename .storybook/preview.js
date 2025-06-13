import "./docs.css";
import "../stories/assets/styles/global/global.scss";

/** @type { import('@storybook/html').Preview } */
const preview = {
  parameters: {
    a11y: {
      context: "body.sb-show-main",
      options: {
        // Includes all rules from WCAG 2.1 AA and lower, Section 508, and best practices.
        runOnly: [
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "best-practice",
          "section508",
        ],
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
