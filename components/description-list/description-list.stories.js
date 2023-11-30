import DescriptionList from "./description-list.html.twig";
import "./description-list.scss";

export default {
  title: "Components/Description List",
  component: DescriptionList,
};

export const Default = {};

export const AccentVivid = {
  args: {
    variant: "accent-vivid",
  },
};

export const AccentCool = {
  args: {
    variant: "accent-cool",
  },
};

export const AccentCoolAlt = {
  args: {
    variant: "accent-cool-alt",
  },
};

export const AccentWarm = {
  args: {
    variant: "accent-warm",
  },
};

export const PrimaryAlt = {
  args: {
    variant: "primary-alt",
  },
};
