// import infoIcon from "@uswds/uswds/img/usa-icons/info_outline.svg";
import QuickFact from "./quick-fact.html.twig";

const items = [
  {
    title: "60%",
    description:
      "Reduction in monthly infrastructure costs for SBA.gov—driven by cloud modernization.",
  },
  {
    title: "200+",
    description:
      "Federal websites are powered by components built and designed by Bixal.",
  },
  {
    title: "7.5<small>B</small>",
    description:
      "Megabytes of Medicaid & CHIP data unified—now used across 13 CMS offices and 7 agencies.",
  },
];

export default {
  title: "Components/Quick Fact",
  tags: ["autodocs"],
  component: QuickFact,
  args: {
    variant: null,
    layout: null,
    items: items.slice(0, 1),
  },
};

export const Default = {};

export const AccentCool = {
  args: {
    variant: "accent-cool",
  },
};

export const Warm = {
  args: {
    variant: "accent-warm",
  },
};

export const CollectionHalves = {
  args: {
    layout: "halves",
    items: items.slice(0, 2),
  },
};

export const CollectionThirds = {
  args: {
    variant: "accent-cool",
    layout: "thirds",
    items: items,
  },
};
