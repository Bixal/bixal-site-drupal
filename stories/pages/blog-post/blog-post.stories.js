import BlogPost from "./blog-post.html.twig";

export default {
  title: "Pages/Blog/Post",
  component: BlogPost,
};

import HeaderContent from "../../components/header/header.content.json";

import "../../components/header/header.stories";
import "../../components/button/button.stories";
import "../../components/hero/hero.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import * as SocialNav from "../../components/social-nav/social-nav.stories";

export const Default = {
  args: {
    ...HeaderContent,
    hero: {
      variant: "image-bg",
      title: "Blog and News",
      image:
        "https://www.bixal.com/static/0af8355f1979d79ddb8e2b9ab90b3a49/blog-and-news-header.png",
    },
    date: "November 16, 2023",
    socialNav: SocialNav.default.args
  },
};
