import Icon from "./icon.html.twig";

export default {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    name: { control: "text" },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    color: { control: "color" },
  },
};

// Default story
export const Default = {};
// Default.args = {};

// Additional story variations can be added here
// export const Small = Template.bind({});
// Small.args = {
//   name: 'small-icon',
//   size: 'small',
// };

// export const Large = Template.bind({});
// Large.args = {
//   name: 'large-icon',
//   size: 'large',
// };
