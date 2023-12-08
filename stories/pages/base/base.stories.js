import Base from "./base.html.twig";

import "../../components/header/header.stories";
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
    hero: {
      variant: "image-bg",
      title: "Hero title",
    },
  },
};
