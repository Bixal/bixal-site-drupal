import Section from "./section.html.twig";
import "./section.scss";

export default {
  title: "Components/Section",
  tags: ["autodocs"],
  component: Section,
};

export const Default = {};

export const Base = {
  args: {
    variant: "base",
  },
};

export const Primary = {
  args: {
    variant: "primary",
  },
};

export const PrimaryAlt = {
  args: {
    variant: "primary-alt",
  },
};
