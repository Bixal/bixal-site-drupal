import EmphasisBlock from "./emphasis-block.html.twig";
import EmphasisBlockCollectionTemplate from "./emphasis-block-collection.html.twig";
import EmphasisBlockCollectionContent from "./emphasis-block-collection.content.json";

import "./emphasis-block.scss";

export default {
  title: "Components/Emphasis Block",
  component: EmphasisBlock,
  args: {
    variant: "",
    heading_type: "h3",
    align: null,
    prefix: "Strategic Growth",
    href: "#",
    title: "Director, Business Development",
    postfix: "Washington D.C. Metro Area",
    body: null,
  },
};

export const Default = {};

export const AlignLeft = {
  args: {
    align: "left",
    prefix: null,
    href: null,
    postfix: null,
    title: "Services",
    body: `
    <ul>
      <li>Agile Project Management</li>
      <li>Content Strategy</li>
      <li>Marketing Research</li>
      <li>Copywriting </li>
      <li>Accessibility/Section 508 Compliance </li>
      <li>Web Modernization</li>
      <li>Human-Centered Design and Customer Experience</li>
      <li>Plain Language Writing </li>
      <li>Drupal Web Development</li>
    </ul>
    `,
  },
};

export const Primary = {
  args: {
    variant: "primary",
    prefix: "Highlight",
    href: null,
    title: "#PartofSomethingBigger",
    postfix:
      "From stakeholder interviews, the importance of their work generated the #PartofSomethingBigger theme. This theme was subsequently used to design the product and the corresponding copy and imagery displayed on HHS.gov/careers.",
  },
};

export const PrimaryAlt = {
  args: {
    variant: "primary-alt",
  },
};

export const AccentCool = {
  args: {
    variant: "accent-cool",
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

export const EmphasisBlockCollection = {
  args: EmphasisBlockCollectionContent,
  render: EmphasisBlockCollectionTemplate,
};
