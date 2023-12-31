import Button from "./button.html.twig";
import "./button.scss";

export default {
  title: "Components/Button",
  tags: ["autodocs"],
  component: Button,
};

export const Default = {};

// @TODO: Refactor so it uses link if there's an HREF set.
export const Link = {
  args: {
    href: null,
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
