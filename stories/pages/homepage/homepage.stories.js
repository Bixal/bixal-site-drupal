import Homepage from "./homepage.html.twig";

export default {
  title: "Pages/Homepage",
  component: Homepage,
};

export const Default = {
  args: {
    hero: {
      variant: "image-inline",
      image:
        "https://www.bixal.com/static/5fe5ae2fa9f9bc458b9dd0914c0b1c9a/ce7bb/img-b-hero-7.webp",
      image_inline: true,
      title: "This is Bixal.",
      description:
        "A mission-driven organization determined to improve people’s lives through human-centered strategies and transformative technologies. We deliver on this promise by partnering with leading federal agencies to conceive and create powerful data-driven customer experiences.",
    },
  },
};
