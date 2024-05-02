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
    label: "Link button",
    href: "javascript:void(0)",
  },
};

export const Inverse = {
  args: {
    variant: "inverse",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Unstyled = {
  args: {
    variant: "unstyled",
  },
}

export const Next = {
  args: {
    label: "Next",
    icon: "arrow-right"
  },
}

export const Previous = {
  args: {
    label: "Previous",
    icon: "arrow-left",
    icon_before: true,
  },
}
