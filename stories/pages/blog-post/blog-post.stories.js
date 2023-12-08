import BlogPost from "./blog-post.html.twig";

export default {
  title: "Pages/Blog/Post",
  tags: ["autodocs"],
  component: BlogPost,
};

export const All = {
  args: {
    hero: {
      variant: "image-bg",
      title: "Blog and News",
      image:
        "https://www.bixal.com/static/0af8355f1979d79ddb8e2b9ab90b3a49/blog-and-news-header.png",
    },
  },
};
