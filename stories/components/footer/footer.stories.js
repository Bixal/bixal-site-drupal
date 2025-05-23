import Footer from "./footer.html.twig";
import FooterContent from "./footer.content.json";
import "../button/button.html.twig";

import "./footer.scss";
import "../button/button.scss";
import "../section/section.scss";

import * as SocialNav from "../social-nav/social-nav.stories";

export default {
  title: "Components/Footer",
  component: Footer,
  args: {
    socialNav: {
      ...SocialNav.default.args,
      aria_label: "Bixal social links",
    },
    ...FooterContent,
  },
};

export const Default = {};
