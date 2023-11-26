import Hero from "./hero.html.twig";
import Content from "./hero.content.json";
import "./hero.scss";

export default {
  title: "Components/Hero",
  tags: ["autodocs"],
  component: Hero,
  args: Content,
};

export const BackgroundImage = {
  args: {
    modifier: "bix-hero--image-bg",
    image:
      "https://www.bixal.com/static/0a66c21e57fc6b5c25b6a4b9055bf84f/landing-hero.jpg",
  },
};

export const InlineImage = {
  args: {
    modifier: "bix-hero--image-inline",
    variant: "primary",
    image:
      "https://www.bixal.com/static/5fe5ae2fa9f9bc458b9dd0914c0b1c9a/ce7bb/img-b-hero-7.webp",
    image_inline: true,
    title: "This is Bixal.",
    description:
      "A mission-driven organization determined to improve people’s lives through human-centered strategies and transformative technologies. We deliver on this promise by partnering with leading federal agencies to conceive and create powerful data-driven customer experiences.",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["Primary", "Accent"],
      defaultValue: "Primary",
    },
  },
};
