import GraphicList from "./graphic-list.html.twig";
import "./graphic-list.scss";
import DescriptionList from "../description-list/description-list.html.twig";

const graphicListContent = {
  items: [
    {
      image_src: "https://www.bixal.com/sites/default/files/2024-08/RGB_bixal_B_people.png",
      heading_type: "h3",
      title: "People: Designing the Human Experience (HX)",
      body: `
      ${DescriptionList({
        title: "Enhancing Public Employee Experiences",
        items: [
          "Accessibility compliance and optimization.",
          "Customer and stakeholder experience research and design.",
          "Employee and operational experience and service design.",
          "Multimedia design.",
        ],
      })}`,
    },
    {
      image_src: "https://www.bixal.com/sites/default/files/2024-09/RGB_bixal_B_content.png",
      title:
        "Content: Creating User-Centric Content Strategies to Drive Effective Communications and Engagement",
      body: `
      ${DescriptionList({
        title: "Engaging Audiences and Stakeholders",
        items: [
          "Brand development and marketing.",
          "Content strategy and implementation.",
          "Stakeholder and audience engagement.",
          "Strategic, data-driven communications.",
          "Writing and editing.",
        ],
      })}`,
    },
    {
      image_src: "https://www.bixal.com/sites/default/files/2024-09/RGB_bixal_B_technology.png",
      title: "Technology: Developing Scalable and Secure Technology Solutions",
      body: `
      ${DescriptionList({
        title: "Building Scalable and Secure Solutions",
        items: [
          "Agile software development.",
          "Automated testing and DevSecOps.",
          "Cloud and shared services optimization.",
          "Cybersecurity and security engineering.",
          "Data pipelines and systems architecture.",
        ],
      })}`,
    },
    {
      image_src: "https://www.bixal.com/sites/default/files/2024-09/RGB_bixal_B_data.png",
      title:
        "Data: Advancing Data Analytics and Evaluation for Decision-Making",
      body: `
      ${DescriptionList({
        title: "Unlocking Insights for Smarter Decisions",
        items: [
          "AI/ML integration for decision-making.",
          "Data engineering, science, analytics, and operations.",
          "Data interoperability optimization.",
          "Data strategy and governance.",
          "Digital marketing analytics.",
          "Impact assessment and monitoring, evaluation, and learning (MEL).",
        ],
      })}`,
    },
    {
      image_src: "https://www.bixal.com/sites/default/files/2024-09/RGB_bixal_B_processes.png",
      title: `Processes: Accelerating Organizational Transformation and Learning`,
      body: `
      ${DescriptionList({
        title: "Optimizing Government Operations",
        items: [
          "Agile transformation and change management.",
          "Digital transformation strategy.",
          "Knowledge management.",
          "Learning and talent development.",
          "Organizational development.",
          "Organizational learning and adaptive management.",
        ],
      })}`,
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
