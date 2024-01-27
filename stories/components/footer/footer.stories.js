import Footer from "./footer.html.twig";
import "../button/button.html.twig";

import "./footer.scss";
import "../button/button.scss";
import "../section/section.scss";

import * as SocialNav from "../social-nav/social-nav.stories";

export default {
  title: "Components/Footer",
  component: Footer,
  args: {
    socialNav: SocialNav.default.args
  }
};

export const Default = {};
