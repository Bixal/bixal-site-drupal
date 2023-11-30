import Callout from "./callout.html.twig";
import Content from "./callout.content.json";
import "./callout.scss";
import "../button/button.html.twig";

export default {
  title: "Components/Callout",
  tags: ["autodocs"],
  component: Callout,
  args: Content,
};

export const Default = {};
