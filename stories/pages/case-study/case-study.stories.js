import CaseStudy from "./case-study.html.twig";

import * as Header from "../../components/header/header.stories";
import "../../components/hero/hero.stories";
import * as ContactUs from "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import * as FooterContent from "../../components/footer/footer.stories";

export default {
  title: "Pages/Case Studies/Case Study",
  component: CaseStudy,
};

export const Default = {
  args: {
    header: Header.default.args,
    sections: [
      {
        variant: "primary-alt",
        heading_type: "h1",
        prefix: "Department of Labor and Education",
        title:
          "Working for Americans: Bixal helps transform WIOA state plan portal",
      },
      {
        body: `
          <h2 class="bix-section__title">Introduction</h2>
          <p>
            The Workforce Innovation and Opportunity Act (WIOA) is designed to strengthen the public workforce system by expanding access to education and training, helping employers hire and retain skilled workers, and creating opportunities for Americans — especially those with significant barriers to employment—to thrive in high-quality careers.
          </p>
          <h2 class="bix-section__title">Challenge</h2>
          <p>
            WIOA requires all U.S. states, territories, and the District of Columbia to regularly submit State Plans outlining how the workforce development system will be implemented. The WIOA State Plan Portal facilitates this process from draft to publication, connecting state and local partners with several federal agencies, including the Departments of Education (ED), and Labor (DOL). Funding is contingent on states having approved plans.
          </p>
          <p>
            In 2018, ED and DOL awarded Bixal the contract to streamline the submission process with a comprehensive upgrade of the platform. The legacy site lacked crucial functionalities, making WIOA compliance burdensome for stakeholders on all sides. Bixal and our federal partners committed to co-creating a robust, user-friendly platform that would remain nimble for years to come.
          </p>
          <h2 class="bix-section__title">Solution</h2>
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
          `,
      },
      {
        variant: "accent-cool",
        title: "Impact",
        body: `
          <strong>State Plan submission processes optimized:</strong>
          <ul>
            <li>Thousands of previously separate grant requirements for every state &mdash; spread across nine offices within five agencies, a total of 15 programs &mdash; streamline into a single grant process.</li>
            <li>All plan elements from previous plan years (2016 and 2018) readily available for reference and knowledge management.
              <ul>
                <li>Complex workflow management controls who can view, comment, or edit portions of a State Plan based on role and plan status</li>
              </ul>
            </li>
            <li>
              The upgraded State Plan Portal gives federal teams shared visibility into workforce development needs in and across states and regions, allowing for integrated and comprehensive approaches in addressing businesses' and workers' needs.
            </li>
            <li>
              Improved user experience, as reflected in consistently and enthusiastically positive stakeholder feedback.
            </li>
          </ul>
          <strong>Upgraded functionality features of State Plan Portal include:</strong>
          <ul>
            <li>Multi-factor authentication.</li>
            <li>Multi-tier moderation.</li>
            <li>Overhauled reporting tools provide a reliable audit trail.</li>
            <li>Dashboards meet users' changing needs.</li>
          </ul>
        `,
      },
      {
        variant: "primary-alt",
        title: "Conclusion",
        body: `
          <p>
            Bixal's work for ED and DOL made it much easier for state and local partners to adhere to WIOA's provisions, facilitated the created of more and better career paths for all Americans, in particular those facing significant hurdles to employment, and demonstrated how well federal agencies can work for the people they serve when they lead with human-centered design and an ethos of constant improvement.
        </p>
        `,
      },
    ],
    contactContent: ContactUs.default.args,
    footerContent: FooterContent.default.args,
  },
};
