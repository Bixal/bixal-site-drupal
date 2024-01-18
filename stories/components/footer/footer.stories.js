import Footer from "./footer.html.twig";
import "../social-nav/social-nav.html.twig";
import "../button/button.html.twig";

import "./footer.scss";
import "../social-nav/social-nav.scss";
import "../button/button.scss";
import "../section/section.scss";

import SocialNavContent from "../social-nav/social-nav.content.json";
import "../social-nav/social-nav.stories";

export default {
  title: "Components/Footer",
  component: Footer,
  args: {
    socialNav: SocialNavContent
  }
};

export const Default = {};
