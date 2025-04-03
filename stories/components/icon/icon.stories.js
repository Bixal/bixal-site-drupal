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
};

// Default story
export const Default = {};
Default.args = {};

export const AllIcons = {
  args: {
    icons: IconConfig.icons.items,
    sizes: IconConfig.icons.sizes,
  },
  render: IconDemo,
};

export const AllSizes = () => {
  return unitSizes.map((size) => Icon({ icon_size: size })).join("");
};
