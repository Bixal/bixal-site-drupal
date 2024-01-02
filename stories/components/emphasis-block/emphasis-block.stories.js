import EmphasisBlock from "./emphasis-block.html.twig";
import EmphasisBlockCollectionTemplate from "./emphasis-block-collection.html.twig";
import EmphasisBlockCollectionContent from "./emphasis-block-collection.content.json";

import "./emphasis-block.scss";

export default {
  title: "Components/Emphasis Block",
  component: EmphasisBlock,
};

export const Default = {
  args: {
    prefix: "Strategic Growth",
    href: "#",
    title: "Director, Business Development",
    postfix: "Washington D.C. Metro Area",
  },
};

export const EmphasisBlockCollection = {
  args: EmphasisBlockCollectionContent,
  render: EmphasisBlockCollectionTemplate,
};
