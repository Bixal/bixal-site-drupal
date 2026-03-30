import Hero from "./hero.html.twig";
import Content from "./hero.content.json";
import "./hero.scss";

export default {
  title: "Components/Hero",
  tags: ["autodocs"],
  component: Hero,
  args: Content,
};

const simpleHeroContent = {
  eyebrow: "Case Study",
  title: "FEMA's life-saving mission",
  subtitle:
    "Educating the public on FEMA's life-saving mission through high-impact visual storytelling",
};

export const Default = {
  args: simpleHeroContent,
};

export const BackgroundImage = {
  args: {
    variant: "image-bg",
    image: "static/0a66c21e57fc6b5c25b6a4b9055bf84f/landing-hero.jpg",
  },
};

export const SplitLeft = {
  args: {
    layout: "split",
    media_position: null,
    image: "static/5fe5ae2fa9f9bc458b9dd0914c0b1c9a/ce7bb/img-b-hero-7.webp",
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

export const SplitRight = {
  args: {
    layout: "split",
    image: "static/5fe5ae2fa9f9bc458b9dd0914c0b1c9a/ce7bb/img-b-hero-7.webp",
    media_position: "right",
    title: "We are Bixal.",
    description:
      "We partner with government agencies to modernize systems, turn data into insight, and design trusted, user-centered solutions that create lasting impact.",
    cta: {
      label: "Discover Bixal",
      href: "javascript:void(0);",
      variant: "inverse",
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["Primary", "Accent"],
      defaultValue: "Primary",
    },
  },
};

export const SplitRightVideo = {
  name: "Split Right / Video",
  args: {
    layout: "split",
    media_position: "right",
    video: "static/hero/B_Video.mp4",
    title: "We are ",
    title_callout: "Bixal.",
    description:
      "We partner with government agencies to modernize systems, turn data into insight, and design trusted, user-centered solutions that create lasting impact.",
    cta: {
      label: "Discover Bixal",
      href: "javascript:void(0);",
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["Primary", "Accent"],
      defaultValue: "Primary",
    },
  },
};
