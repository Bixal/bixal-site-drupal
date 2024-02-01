import Base from "./base.html.twig";

import * as Header from "../../components/header/header.stories";
import * as SocialNav from "../../components/social-nav/social-nav.stories";

import "../../components/hero/hero.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";

export default {
  title: "Pages/Base",
  tags: ["autodocs"],
  component: Base,
};

export const Default = {
  args: {
    header: Header.default.args,
    hero: {
      variant: "image-bg",
      title: "Hero title",
    },
    socialNav: SocialNav.default.args
  },
};
