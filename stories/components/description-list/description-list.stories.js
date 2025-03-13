import DescriptionList from "./description-list.html.twig";
import DescriptionListCollection from "./description-list-collection.html.twig";
import DescriptionListCollectionContent from "./description-list-collection.content.json";

import "./description-list.scss";

export default {
  title: "Components/Description List",
  component: DescriptionList,
};

export const Default = {};

export const AccentCool = {
  args: {
    variant: "accent-cool",
  },
};

export const AccentCoolAlt = {
  args: {
    variant: "accent-cool-alt",
    title: "International Development",
    items: ["United States Agency for International Development"],
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

export const PrimaryAlt = {
  args: {
    variant: "primary-alt",
  },
};

export const DescriptionCollection = {
  args: DescriptionListCollectionContent,
  render: DescriptionListCollection,
};
