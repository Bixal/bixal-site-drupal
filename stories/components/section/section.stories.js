import Section from "./section.html.twig";
import "./section.scss";
import "../button/button.scss";

import "../button/button.stories";

export default {
  title: "Components/Section",
  tags: ["autodocs"],
  component: Section,
  args: {
    center_content: false,
    prefix: "Who we are",
    prefix_below: 0,
    prefix_label: '',
    heading_type: "h2",
    title:
      "Bixal is a diverse group of strategists, designers, engineers, and thinkers.",
    description:
      "Our common belief is that everyone has the right to an effective government. Every day, we come to work focused on helping our federal partners deliver a better customer experience to the American public and communities around the world. We value kindness, humility, and collaboration. Our culture is felt the moment you walk in the door, and it is reflected across our entire team.",
  },
  argTypes: {
    heading_type: {
      defaultValue: { summary: "h2" },
      description: "Heading level, ex: h1, h2, h3, h4, h5, h6",
    },
    prefix: {
      description: "Optional title prefix with borders on the side.",
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

export const AccentCool = {
  args: {
    center_content: true,
    variant: "accent-cool",
    prefix: "Work with us",
    title:
      "Bixal is filled with incredibly smart, creative, and passionate people. If you’re interested in joining our team, drop us a line or check out our careers page.",
    description: null,
  },
};

export const BackgroundImage = {
  args: {
    additional_classes: ["bix-section--primary"],
    image: "static/img-whatwedo-e68b3d20abd32c896d56b122063f7664.jpg",
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
    center_content: true,
    image: "static/img-careers-269d29ea5a43482c6c0b920bdd5e9d87.jpg",
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
