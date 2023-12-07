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

export const Inverse = {
  args: {
    variant: "inverse",
  },
};

export const Centered = {
  args: {
    variant: "centered",
    image:
      "https://www.bixal.com/static/img-careers-269d29ea5a43482c6c0b920bdd5e9d87.jpg",
    prefix: "Work with us",
    title:
      "Bixal is filled with incredibly smart, creative, and passionate people. If you’re interested in joining our team, drop us a line or check out our careers page.",
    description: null,
  },
};
