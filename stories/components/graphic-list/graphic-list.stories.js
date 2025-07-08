import GraphicList from "./graphic-list.html.twig";
import "./graphic-list.scss";

import "../../components/icon/icon.stories";

const graphicListContent = {
  items: [
    {
      icon: {
        name: "security",
        size: 9,
      },
      heading_type: "h3",
      title: "Build modern, secure, and scalable platforms",
      body: `
      <p>
        Modernize platforms that government agencies can easily deploy, sustain, and scale.
      </p>
      <ul class="bix-list">
        <li>DevSecOps</li>
        <li>Cloud migration</li>
        <li>Automation/AI</li>
        <li>Cybersecurity</li>
        <li>Platform modernization</li>
      </ul>
      `,
    },
    {
      icon: {
        name: "insights",
        size: 9,
      },
      title: "Turn complex data into actionable intelligence",
      body: `
      <p>
        Unlock smarter decisions through structured data, practical AI, and real-time analytics that support mission delivery.
      </p>
      <ul class="bix-list">
        <li>Data engineering</li>
        <li>AI/ML</li>
        <li>Dashboards</li>
        <li>Interoperability</li>
        <li>Impact evaluation</li>
      </ul>
      `,
    },
    {
      icon: {
        name: "sentiment_satisfied_alt",
        size: 9,
      },
      title: "Design services people can actually use",
      body: `
        <p>Simplify user experiences and reduce friction, improving adoption, clarity, and public trust in government services.</p>
        <ul class="bix-list">
          <li>Service delivery</li>
          <li>CX/UX</li>
          <li>Service optimization</li>
          <li>Human-centered design</li>
        </ul>
      `,
    },
    {
      icon: {
        name: "campaign",
        size: 9,
      },
      title: "Strategic content and communications",
      body: `
      <p>
        Develop content, messaging, and campaigns that inform, engage, and drive action.
      </p>
      <ul class="bix-list">
        <li>Strategic content</li>
        <li>Engagement strategy</li>
        <li>Public campaigns</li>
        <li>Targeted messaging</li>
      </ul>
      `,
    },
    {
      icon: {
        name: "school",
        size: 9,
      },
      title: `Build workforce capacity for today and the future`,
      body: `
        <p>Support and equip teams to adapt, grow, and sustain mission delivery through change.</p>
        <ul class="bix-list">
          <li>Change management</li>
          <li>Agile ops</li>
          <li>Capacity building</li>
          <li>Performance optimization</li>
        </ul>
      `,
    },
  ],
};

export default {
  title: "Components/Graphic List",
  tags: ["autodocs"],
  component: GraphicList,
  args: graphicListContent,
};

export const Default = {};

export const Background = {
  args: {
    ...graphicListContent,
    variant: "background",
  },
};
