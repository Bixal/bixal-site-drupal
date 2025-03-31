import Example from "./example.html.twig";
import "./example.scss";

// import infoIcon from "@uswds/uswds/img/usa-icons/info_outline.svg";

export default {
  title: "Components/Example Component",
  tags: ["autodocs"],
  component: Example,
};

export const Default = {};

export const Custom = {
  args: {
    title: "Hola mundo",
  },
};
