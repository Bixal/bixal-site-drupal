import Hero from "./hero.html.twig";
import "./hero.scss";

import { DecorativeVideo } from "../video/video.stories.js";

export default {
  title: "Components/Hero",
  tags: ["autodocs"],
  component: Hero,
  args: {
    variant: "",
    heading_type: "h1",
    sub_heading_type: "h2",
    eyebrow: "",
    title: "Title",
    title_callout: "",
    subtitle: "",
    description: "",
    image: "",
    cta: {
      label: "",
      href: "",
      variant: [""],
      additional_classes: [""],
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["image-bg", "split"],
    },
  },
};

const simpleHeroContent = {
  eyebrow: "Case Study",
  title: "FEMA's life-saving mission",
  subtitle: "Testing the publish StorybookJS workfow.",
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
    variant: "split",
    media_position: null, // Hero uses left by default.
    image: "static/5fe5ae2fa9f9bc458b9dd0914c0b1c9a/ce7bb/img-b-hero-7.webp",
    title: "We are Bixal.",
    description:
      "A mission-driven organization determined to improve people’s lives through human-centered strategies and transformative technologies. We deliver on this promise by partnering with leading federal agencies to conceive and create powerful data-driven customer experiences.",
  },
  argTypes: {
    media_position: {
      control: "select",
      options: ["left", "right"],
      defaultValue: "left",
    },
  },
};

export const SplitRight = {
  args: {
    ...SplitLeft.args,
    media_position: "right",
    cta: {
      label: "Discover Bixal",
      href: "javascript:void(0);",
      variant: "inverse",
    },
  },
};

export const SplitRightVideo = {
  name: "Split Right / Video",
  args: {
    ...SplitRight.args,
    image: "",
    video: DecorativeVideo.args.video_src,
    title: "We are ",
    title_callout: "Bixal.",
    description:
      "We partner with government agencies to modernize systems, turn data into insight, and design trusted, user-centered solutions that create lasting impact.",
  },
  argTypes: {
    ...SplitRight.argTypes,
  },
};
