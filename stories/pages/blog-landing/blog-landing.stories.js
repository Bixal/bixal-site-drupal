import BlogLanding from "./blog-landing.html.twig";

import BlurbCollectionContent from "../../components/blurb/blurb-collection.content.json";

export default {
  title: "Pages/Blog/Landing",
  tags: ["autodocs"],
  component: BlogLanding,
};

export const All = {
  args: {
    hero: {
      variant: "image-bg",
      title: "Blog and News",
      image:
        "https://www.bixal.com/static/0af8355f1979d79ddb8e2b9ab90b3a49/blog-and-news-header.png",
    },
    blurbs: BlurbCollectionContent,
  },
};
