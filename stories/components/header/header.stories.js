import Header from "./header.html.twig";

import HeaderContent from "./header.content.json";
import "./header.js";
import "./header.scss";
import "../button/button.scss";

export default {
  title: "Components/Header",
  component: Header,
  args: HeaderContent,
};

export const Default = {};
