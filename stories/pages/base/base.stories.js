import Base from "./base.html.twig";

import HeaderContent from "../../components/header/header.content.json";
import SocialNavContent from "../../components/social-nav/social-nav.content.json";

import "../../components/header/header.stories";
import "../../components/hero/hero.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";

import "../../components/social-nav/social-nav.stories";

export default {
  title: "Pages/Base",
  tags: ["autodocs"],
  component: Base,
};

export const Default = {
  args: {
    header: HeaderContent,
    hero: {
      variant: "image-bg",
      title: "Hero title",
    },
    socialNav: SocialNavContent
  },
};
