import Typography from "./typography.html.twig";
import "../description-list/description-list.html.twig";

const lorem = `Lorem, ipsum dolor sit amet consectetur adipisicing elit.`

export default {
  title: "Components/Typography",
  tags: ["autodocs"],
  component: Typography,
};

export const All = {};

export const Colors = {
  render: () => `
    <div class="text-primary">${lorem}</div>
    <div class="text-primary-alt">${lorem}</div>
    <div class="text-accent-cool">${lorem}</div>
    <div class="text-accent-warm">${lorem}</div>
    <div class="text-accent-vivid">${lorem}</div>
  `,
}
