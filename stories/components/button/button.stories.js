import Button from "./button.html.twig";
import "./button.scss";

export default {
  title: "Components/Button",
  tags: ["autodocs"],
  component: Button,
};

export const Default = {};

export const Link = {
  args: {
    link: true,
    has_icon: true,
  },
};

export const Inverse = {
  args: {
    modifier: "bix-button--inverse",
    has_icon: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
