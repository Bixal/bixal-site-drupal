import Typography from "./typography.html.twig";
import "../description-list/description-list.html.twig";

const lorem = `Lorem, ipsum dolor sit amet consectetur adipisicing elit.`;

export default {
  title: "Components/Typography",
  tags: ["autodocs"],
  component: Typography,
};

const brandColors = [
  "primary",
  "primary-alt",
  "accent-cool",
  "accent-warm",
  "accent-vivid",
];

export const All = {};

export const Colors = {
  render: () => {
    return brandColors
      .map(
        (color) => `<div class=text-${color}>${lorem} - "text-${color}"</div>`,
      )
      .join("");
  },
};
