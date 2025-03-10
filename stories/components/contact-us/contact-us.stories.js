import ContactUs from "./contact-us.html.twig";

import "./contact-us.scss";
import "../section/section.scss";
import "../button/button.html.twig";
import "../button/button.scss";

import "../button/button.html.twig";

export default {
  title: "Components/Contact Us",
  component: ContactUs,
  args: {
    section_additional_classes: ["bix-contact"],
    section_prefix: "Contact",
    section_variant: "primary",
    section_title: "How can we help? <br /> We'd love to hear from you.",
    hint: `<p>Required fields are marked with an asterisk&nbsp;(<abbr title="required" class="bix-hint bix-hint--required">*</abbr>).</p>`,
    form: {
      grid: "bix-grid bix-grid:tablet--halves",
      items: [
        {
          label: "Name",
          id: "edit-name",
          class: "bix-grid__item bix-grid__item--full",
          placeholder: "Johnathan Doe",
          required: true,
        },
        {
          label: "Email",
          type: "email",
          id: "edit-email",
          class: "bix-grid__item",
          placeholder: "example@organization.com",
          required: true,
        },
        {
          label: "Company",
          id: "edit-company",
          class: "bix-grid__item",
          placeholder: "Acme Co",
          required: false,
        },
        {
          label: "Message",
          type: "textarea",
          id: "edit-message",
          class: "bix-grid__item bix-grid__item--full",
          placeholder:
            "Want to find out more or interested in doing business with us? type message here…",
          required: true,
        },
      ],
    },
    captcha: `<p class="bix-grid__item--full">This question is for testing whether or not you are a human visitor and to prevent automated spam submissions.</p>`,
    actions: [
      {
        type: "submit",
        label: "Submit",
        variant: "inverse",
        icon: "arrow-right",
      },
      // For demo purposes only.
      {
        type: "reset",
        label: "Reset",
        variant: "unstyled",
      },
    ],
  },
};

export const Default = {};
