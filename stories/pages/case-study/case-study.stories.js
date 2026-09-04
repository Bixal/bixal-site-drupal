import CaseStudy from "./case-study.html.twig";

import * as Header from "../../components/header/header.stories";
import * as Hero from "../../components/hero/hero.stories";
import * as ContactUs from "../../components/contact-us/contact-us.stories";
import * as FooterContent from "../../components/footer/footer.stories";

import Prose from "../../components/prose/prose.html.twig";
import IconFeature from "./_icon-feature.html.twig";

import "../../components/emphasis-block/emphasis-block.stories";
import "../../components/icon/icon.stories";

export default {
  title: "Pages/Case Studies/Case Study",
  component: CaseStudy,
};

export const Default = {
  args: {
    header: Header.default.args,
    hero: Hero.PrimaryAlt.args,
    meta: {
      additional_classes: ["case-study__meta"],
      size: "sm",
      blocks: [
        {
          align: "left",
          title: "Profile",
          body: `
          <h4>Partners</h4>
          <ul>
            <li>U.S. Department of Homeland Security (DHS)</li>
            <li>Federal Emergency Management Agency (FEMA)</li>
          </ul>
          <h4>Domain</h4>
          <ul>
            <li>FEMA.gov</li>
          </ul>`,
        },
        {
          align: "left",
          title: "Services",
          prefix: null,
          href: null,
          postfix: null,
          body: `
          <ul>
            <li>Agile Project Management</li>
            <li>Content Strategy</li>
            <li>Marketing Research</li>
            <li>Copywriting</li>
            <li>Accessibility/Section 508 Compliance</li>
            <li>Web Modernization</li>
            <li>Human-Centered Design and Customer Experience</li>
            <li>Plain Language Writing</li>
            <li>Drupal Web Development</li>
          </ul>`,
        },
      ],
    },
    glance: {
      title: `At a glance`,
      challenge:
        "Over the years, FEMA has built an extensive video library. Yet, the American public still was not engaging with its mission or messages. The agency wanted and needed a more cohesive way of telling its story to ensure the core outcome - reaching and educating the American public on its roles and responsibilities - was met.",
      solution:
        "Our team recognized the opportunity to provide clearer messaging and better brand consistency through video storytelling, expanding the reach and deepening engagement with core audiences on the great work FEMA does.",
      results:
        "Bixal created a cohesive, branded multimedia template library and produced multiple high-impact, Section 508 compliant videos that showcase FEMA’s life-saving work as part of a broader effort to share their message on the agency’s role after disasters strike. Our collaborative work on the animated piece — “Building a Resilient Nation” — won a 2020 Bronze Telly Award.",
    },
    highlight: {
      variant: "accent-vivid",
      prefix: "Highlight",
      title: "#PartofSomethingBigger",
      body: "From stakeholder interviews, the importance of their work generated the #PartofSomethingBigger theme. This theme was subsequently used to design the product and the corresponding copy and imagery displayed on HHS.gov/careers.",
    },
    body: `${Prose({
      content: `
        <h2>Introduction</h2>
        <p>
          The Workforce Innovation and Opportunity Act (WIOA) is designed to strengthen the public workforce system by expanding access to education and training, helping employers hire and retain skilled workers, and creating opportunities for Americans — especially those with significant barriers to employment—to thrive in high-quality careers.
        </p>
        <h2>Challenge</h2>
        <p>
          WIOA requires all U.S. states, territories, and the District of Columbia to regularly submit State Plans outlining how the workforce development system will be implemented. The WIOA State Plan Portal facilitates this process from draft to publication, connecting state and local partners with several federal agencies, including the Departments of Education (ED), and Labor (DOL). Funding is contingent on states having approved plans.
        </p>
        <p>
          In 2018, ED and DOL awarded Bixal the contract to streamline the submission process with a comprehensive upgrade of the platform. The legacy site lacked crucial functionalities, making WIOA compliance burdensome for stakeholders on all sides. Bixal and our federal partners committed to co-creating a robust, user-friendly platform that would remain nimble for years to come.
        </p>
        <h2>Solution</h2>
        <p>
          Bixal began by auditing the user experience (UX) across the State Plan lifecycle, building a solid foundation for holistic UX that adheres to the highest standards of accessibility, in order to translate customer needs into optimized functionality and processes.
        </p>
        <strong>Key aspects of our solution included:</strong>
        <ul>
          <li>Building an application to manage creation, modification, and year-to-year traceability of thousands of requirements.</li>
          <li>Developing templates for individual state plans, supported by rigorous, multi-tiered, role-based workflow.</li>
          <li>Integrating nearly 60,000 pages of data into a single, easily navigable site.</li>
          <li>Pivoting several times to meet new and emerging security and governance requirements, for example:
            <ul>
              <li>Pivoted to Acquia cloud-based hosting as a service (PaaS) when the ED platform faced delays.</li>
              <li>Integrated login.gov to comply with new OMB directive.</li>
            </ul>
          </li>
        </ul>
        ${IconFeature({
          features: [
            {
              icon: {
                name: "code",
                background: "primary",
                size: 6,
              },
              heading: "Technology",
              body: "Drupal 9, USAJOBS API, React.js, Leaflet Map API",
            },
            {
              icon: {
                name: "assessment",
                background: "primary",
                size: 6,
              },
              heading: "Methodology",
              body: "We used Agile methodology and Scrum framework.",
            },
            {
              icon: {
                name: "support_agent",
                background: "primary",
                size: 6,
              },
              heading: "Customer Support",
              body: "To support customers, we developed a go-to-market project plan and social media toolkit for the product launch.",
            },
          ],
        })}`,
    })}`,
    impact: {
      variant: "base",
      prefix: "Impact",
      title: "A more consistent voice",
      center_content: true,
      body: "Bixal’s team provided an improved approach to FEMA’s video library and assisted the agency in building a more consistent voice for their brand with more in-depth and engaging narratives.",
    },
    conclusion: {
      variant: "primary-alt",
      title: "Conclusion",
      body: `
        <p>
          This was not a simple application website. Bixal delivered a website telling the story of HHS employees and provided a refreshed user experience for potential HHS employees. Much research and engagement went into the discovery to deliver valuable results to the OHR.
      </p>`,
    },
    contactContent: ContactUs.default.args,
    footerContent: FooterContent.default.args,
  },
};
