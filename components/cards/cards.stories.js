import Cards from "./cards.html.twig";
import ClickableCard from "./card-clickable.html.twig";

export default {
  title: "Components/Cards",
  tags: ["autodocs"],
  component: Cards,
};

export const Default = {};

export const Clickable = {
  render: ClickableCard,
};
