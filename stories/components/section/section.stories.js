import Section from "./section.html.twig";
import "./section.scss";
import "../button/button.scss";

export default {
  title: "Components/Section",
  tags: ["autodocs"],
  component: Section,
  args: {
    prefix: "Who we are",
    title:
      "Bixal is a diverse group of strategists, designers, engineers, and thinkers.",
    description:
      "Our common belief is that everyone has the right to an effective government. Every day, we come to work focused on helping our federal partners deliver a better customer experience to the American public and communities around the world. We value kindness, humility, and collaboration. Our culture is felt the moment you walk in the door, and it is reflected across our entire team.",
  },
  argTypes: {
    prefix: {
      description: "Title prefix with borders on the side.",
    },
    description: {
      description: "Accepts markup, like paragraphs.",
    },
  },
};

export const Default = {};

export const Base = {
  args: {
    variant: "base",
  },
};

export const Primary = {
  args: {
    variant: "primary",
  },
};

export const PrimaryAlt = {
  args: {
    variant: "primary-alt",
  },
};

export const Centered = {
  args: {
    variant: "centered",
    image:
      "https://www.bixal.com/static/img-careers-269d29ea5a43482c6c0b920bdd5e9d87.jpg",
    prefix: "Work with us",
    title:
      "Bixal is filled with incredibly smart, creative, and passionate people. If you’re interested in joining our team, drop us a line or check out our careers page.",
    description: null,
  },
};

export const BackgroundImage = {
  args: {
    variant: "image-bg",
    additional_classes: "bix-section--primary",
    image:
      "https://www.bixal.com/static/img-whatwedo-e68b3d20abd32c896d56b122063f7664.jpg",
    prefix: "What we do",
    title:
      "The work we do helps our clients unite stakeholders, optimize resources, and better serve citizens all over the world.",
    description:
      "We take a people-absolutely-first approach to solving complex organizational challenges and gracefully balance cutting-edge technical chops with a deep sense of empathy and understanding. We relentlessly focus on outcomes and weave it all together with a unique agility that permeates across everything we do.",
    cta: {
      variant: "inverse",
      icon: "arrow-right",
      href: "javascript:void(0)",
      label: "Explore case studies",
    },
  },
};

export const Tall = {
  args: {
    variant: "tall",
    additional_classes: "bix-section--centered",
    image:
      "https://www.bixal.com/static/img-careers-269d29ea5a43482c6c0b920bdd5e9d87.jpg",
    prefix: "What we do",
    title:
      "The work we do helps our clients unite stakeholders, optimize resources, and better serve citizens all over the world.",
    description: null,
    cta: {
      href: "javascript:void(0)",
      label: "Explore case studies",
      icon: "arrow-right",
    },
  },
};
