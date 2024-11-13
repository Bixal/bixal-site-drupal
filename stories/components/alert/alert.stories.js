import Alert from "./alert.html.twig";
import "./alert.scss";
import infoIcon from "@uswds/uswds/img/usa-icons/info_outline.svg";
import warningIcon from "@uswds/uswds/img/usa-icons/warning.svg";
import errorIcon from "@uswds/uswds/img/usa-icons/error_outline.svg";

export default {
  title: "Components/Alert",
  tags: ["autodocs"],
  component: Alert,
};

const defaultContent = {
  title: "Important Notice for Applicants",
  text: `
    <p>
      At Bixal, we want to ensure a transparent and secure application process for all candidates. Please note that:
    </p>
    <ul>
      <li>Our recruiters will never request sensitive personal information (such as social security numbers or banking information).</li>
      <li>Our messages will never include requests to download applications or attachments.</li>
      <li>Legitimate recruitment communications will always include clear contact details and may reference our public job postings.</li>
    </ul>
    <p>
      If you experience any challenges with your submission or need assistance in completing your application for accessibility purposes, please reach out to us. <strong><a href="mailto:talent@bixal.com">We're here to help</a></strong>!
    </p>
  `,
};

export const Default = {
  args: {
    heading_type: null,
    ...defaultContent,
  },
};

export const Info = {
  args: {
    ...defaultContent,
    icon: infoIcon,
    variant: "info",
  },
};

export const Warning = {
  args: {
    ...defaultContent,
    icon: warningIcon,
    variant: "warning",
  },
};

export const Error = {
  args: {
    ...defaultContent,
    icon: errorIcon,
    variant: "error",
  },
};
