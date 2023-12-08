import Blurb from "./blurb.html.twig";
import BlurbCollectionTemplate from "./blurb-collection.html.twig";
import BlurbCollectionContent from "./blurb-collection.content.json";

import "./blurb.scss";

export default {
  title: "Components/Blurb",
  component: Blurb,
  args: {
    title: "Key Learnings for a More Inclusive Global Health Landscape",
    description: null,
    date: "November 30, 2023",
  },
};

export const Default = {};

export const BlurbCollection = {
  args: BlurbCollectionContent,
  render: BlurbCollectionTemplate,
};
