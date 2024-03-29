import Blurb from "./blurb.html.twig";
import BlurbCollectionTemplate from "./blurb-collection.html.twig";
import BlurbCollectionContent from "./blurb-collection.content.json";
import BlurbCollectionContentFeatured from "./blurb-collection-featured.content.json";

import "./blurb.scss";

export default {
  title: "Components/Blurb",
  tags: ["autodocs"],
  component: Blurb,
};

export const Default = {
  args: {
    title: "Key Learnings for a More Inclusive Global Health Landscape",
    description: null,
    date: "November 30, 2023",
    in_collection: false,
  },
};

export const BlurbCollection = {
  args: BlurbCollectionContent,
  render: BlurbCollectionTemplate,
};

export const BlurbCollectionThreeUp = {
  args: {
    ...BlurbCollectionContent,
    variant: "three-up",
  },
  render: BlurbCollectionTemplate,
};

export const BlurbCollectionFeatured = {
  args: BlurbCollectionContentFeatured,
  render: BlurbCollectionTemplate,
};
