import Input from "./input.html.twig";
// import "./example-component.scss";

import infoIcon from "@uswds/uswds/img/usa-icons/info_outline.svg";

export default {
  title: "Components/Form/Input",
  tags: ["autodocs"],
  component: Input,
};

export const Default = {
  args: {
    label: "Text input",
    id: "text-input-name",
  },
};

export const Textarea = {
  args: {
    label: "Message",
    id: "message",
    type: "textarea",
    placeholder:
      "Want to find out more or interested in doing business with us? Type message here…",
  },
};
