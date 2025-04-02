import BlogPost from "./blog-post.html.twig";

export default {
  title: "Pages/Blog/Post",
  component: BlogPost,
};

import * as Header from "../../components/header/header.stories";
import "../../components/button/button.stories";
import "../../components/hero/hero.stories";
import * as Prose from "../../components/prose/prose.stories";
import * as ContactUs from "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import * as FooterContent from "../../components/footer/footer.stories";

export const Default = {
  args: {
    header: Header.default.args,
    hero: {
      variant: "image-bg",
      title: "Blog and News",
      image:
        "/static/0af8355f1979d79ddb8e2b9ab90b3a49/blog-and-news-header.png",
    },
    blog: {
      title:
        "Bixal’s Approach to Agile Learning: Introducing the Modern Responsiveness Approach",
      date: "December 10, 2024",
      author: "DJ Neace, Instructional Designer",
      ...Prose.Default.args,
    },
    contactContent: ContactUs.default.args,
    footerContent: FooterContent.default.args,
  },
};
