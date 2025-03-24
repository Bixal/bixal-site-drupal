import EmphasisBlock from "./emphasis-block.html.twig";
import EmphasisBlockCollectionTemplate from "./emphasis-block-collection.html.twig";
import EmphasisBlockCollectionContent from "./emphasis-block-collection.content.json";

import "./emphasis-block.scss";

export default {
  title: "Components/Emphasis Block",
  component: EmphasisBlock,
  args: {
    variant: "",
    prefix: "Strategic Growth",
    href: "#",
    title: "Director, Business Development",
    postfix: "Washington D.C. Metro Area",
  },
};

export const Default = {};

export const Base = {
  args: {
    variant: "base",
  },
};

export const AccentCool = {
  args: {
    variant: "accent-cool",
  },
};

export const AccentCoolAlt = {
  args: {
    variant: "accent-cool-alt",
  },
};

export const AccentVivid = {
  args: {
    variant: "accent-vivid",
  },
};

export const AccentWarm = {
  args: {
    variant: "accent-warm",
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

export const Collection = {
  args: {
    ...EmphasisBlockCollectionContent,
  },
  render: EmphasisBlockCollectionTemplate,
};

export const CollectionWithVariants = {
  args: {
    ...EmphasisBlockCollectionContent,
    variant: "primary",
  },
  render: EmphasisBlockCollectionTemplate,
};
