import Icon from "./icon.html.twig";
import IconDemo from "./icon-demo.html.twig";

import "./icon.scss";
import IconConfig from "../../../node_modules/@uswds/uswds/packages/usa-icon/src/usa-icon.json";

const unitSizes = IconConfig.icons.sizes.map((size) => size.units);

export default {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    name: { control: "text" },
    icon_size: {
      control: { type: "select" },
      options: unitSizes,
    },
    color: { control: "color" },
  },
  decorators: [
    (Story, { args }) => `
      <div style="color: ${args.color || "initial"}">
        ${Story()}
      </div>
    `,
  ],
};

// Default story
export const Default = {};
Default.args = {};
Default.decorators = [
  (Story, { args }) => `
    <div style="color: ${args.color || "initial"};">
      ${Story()}
    </div>
  `,
];

export const AllIcons = {
  args: {
    icons: IconConfig.icons.items,
    sizes: IconConfig.icons.sizes,
  },
  render: IconDemo,
};

export const AllSizes = {
  decorators: [
    (Story, { args }) => `
      <div
        style="color: ${args.color || "initial"}; display: flex; column-gap: 1rem; align-items: baseline;">
        ${Story()}
      </div>
    `,
  ],
  render: (args) =>
    unitSizes.map((size) => Icon({ ...args, icon_size: size })).join(""),
};

export const CircleBase = {
  ...AllSizes,
  args: {
    circle: true
  },
};

export const CirclePrimary = {
  ...CircleBase,
  args: {
    ...CircleBase.args,
    background: "primary"
  },
};

export const CirclePrimaryAlt = {
  ...CircleBase,
  args: {
    ...CircleBase.args,
    background: "primary-alt"
  },
};

export const CircleAccentCool = {
  ...CircleBase,
  args: {
    ...CircleBase.args,
    background: "accent-cool"
  },
};

export const CircleAccentWarm = {
  ...CircleBase,
  args: {
    ...CircleBase.args,
    background: "accent-warm"
  },
};

export const CircleAccentVivid = {
  ...CircleBase,
  args: {
    ...CircleBase.args,
    background: "accent-vivid"
  },
};
