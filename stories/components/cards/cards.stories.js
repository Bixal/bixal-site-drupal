import FlipCardGroup from "./flip-card-group.html.twig";
import ClickableCard from "./card-clickable.html.twig";
import FlipCardContent from "./flip-card.content.json";

import "./cards.scss";

export default {
  title: "Components/Cards",
  tags: ["autodocs"],
  component: FlipCardGroup,
  args: FlipCardContent,
};

// @TODO: Create individual card components.
export const FlipCards = {};

export const Clickable = {
  render: ClickableCard,
};
