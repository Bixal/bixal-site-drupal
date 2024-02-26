import CaseStudy from "./case-study.html.twig";

import * as Header from "../../components/header/header.stories";
import "../../components/hero/hero.stories";
import * as Blurb from "../../components/blurb/blurb.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import * as SocialNav from "../../components/social-nav/social-nav.stories";

export default {
  title: "Pages/Case Studies/Case Study",
  component: CaseStudy,
};

export const Default = {
  args: {
    header: Header.default.args,
    hero: {
      variant: "image-bg",
      title: "Building cybersecurity capacity of civil society organizations in Colombia to improve digital health and protect against cyber threats.",
      image: "https://www.bixal.com/static/d6b25ad6c22c438dde0709d18958c405/digital-apex-1.png",
    },
    socialNav: SocialNav.default.args
  },
};
