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
    section_prefix: "Contact",
    section_variant: "primary",
    section_title: "How can we help? <br /> We'd love to hear from you.",
    hint: `<p>Required fields are marked with an asterisk (<abbr title: "required" class="bix-hint bix-hint--required">*</abbr>).</p>`,
    form: {
      grid: "bix-grid:tablet--halves",
      items: [
        {
          label: "Name",
          placeholder: "Johnathan Doe",
          required: true,
        },
        {
          label: "Email",
          type: "email",
          placeholder: "example@organization.com",
          required: true,
        },
        {
          label: "Company",
          placeholder: "Acme Co",
          required: false,
        },
        {
          label: "Message",
          type: "textarea",
          placeholder:
            "Want to find out more or interested in doing business with us? type message here…",
          required: true,
        },
      ],
    },
    captcha: `{{ CAPTCHA }}`,
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
        variant: "inverse",
      },
    ],
  },
};

export const Default = {};
