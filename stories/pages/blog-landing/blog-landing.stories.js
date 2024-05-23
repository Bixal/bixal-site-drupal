import BlogLanding from "./blog-landing.html.twig";

import HeaderContent from "../../components/header/header.content.json";
import BlurbCollectionContent from "../../components/blurb/blurb-collection.content.json";

import "../../components/header/header.stories";
import "../../components/hero/hero.stories";
import "../../components/blurb/blurb.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import "../../components/social-nav/social-nav.stories";

import * as FooterContent from "../../components/footer/footer.stories";

export default {
  title: "Pages/Blog/Landing",
  component: BlogLanding,
};

export const Default = {
  args: {
    header: HeaderContent,
    hero: {
      variant: "image-bg",
      title: "Blog and News",
      image:
        "/static/0af8355f1979d79ddb8e2b9ab90b3a49/blog-and-news-header.png",
    },
    blurbs: BlurbCollectionContent,
    footerContent: FooterContent.default.args
  },
};
