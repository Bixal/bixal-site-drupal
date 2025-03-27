import CaseStudy from "./case-study.html.twig";

import * as Header from "../../components/header/header.stories";
import "../../components/hero/hero.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import "../../components/emphasis-block/emphasis-block.stories";
import "../../components/description-list/description-list.stories";
import * as FooterContent from "../../components/footer/footer.stories";

import codeIcon from "@uswds/uswds/img/usa-icons/code.svg";
import supportIcon from "@uswds/uswds/img/usa-icons/support_agent.svg";
import graphIcon from "@uswds/uswds/img/usa-icons/assessment.svg";

import "./case-studies.scss";

export default {
  title: "Pages/Case Studies/Case Study",
  component: CaseStudy,

  args: {
    header: Header.default.args,
    footerContent: FooterContent.default.args,
  },
};

export const Default = {
  args: {
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
  },
};

export const Alternative = {
  args: {
    sections: [
      {
        variant: "primary-alt",
        heading_type: "h1",
        prefix: "Case Study",
        title: "FEMA's life-saving mission",
        subtitle:
          "<h2>Educating the public on FEMA's life-saving mission through high-impact visual storytelling</h2>",
      },
      {
        description: `
          <div class="bix-project-metadata">
            <div className="bix-project-metadata__item">
              <dl class="bix-description-list bix-description-list--accent-cool-alt">
                <dt>Partners</dt>
                <dd>U.S. Department of Homeland Security (DHS)</dd>
                <dd>Federal Emergency Management Agency (FEMA)</dd>
                <dt>Domain</dt>
                <dd>FEMA.gov</dd>
              </dl>
            </div>
            <div class="bix-project-metadata__item">
              <dl class="bix-description-list bix-description-list--accent-cool-alt">
                <dt>Services</dt>
                <!-- <dd>Videography, Content Strategy, Branding</dd> -->
                <!--
                <dd>Agile Project Management • Content Strategy • Marketing Research • Copywriting • Accessibility/Section 508 Compliance • Web Modernization • Human-Centered Design and Customer Experience • Plain Language Writing • Drupal Web Development</dd>
                -->

                <dd>Agile Project Management</dd>
                <dd>Content Strategy</dd>
                <dd>Marketing Research</dd>
                <dd>Copywriting</dd>
                <dd>Accessibility/Section 508 Compliance</dd>
                <dd>Web Modernization</dd>
                <dd>Human-Centered Design and Customer Experience</dd>
                <dd>Plain Language Writing</dd>
                <dd>Drupal Web Development</dd>
              </dl>
            </div>
          </div>

          <div class="bix-case-study__subsection">
            <h2>At a glance</h2>
            <div class="bix-case-breakdown">
              <div>
                <h3>Challenge</h3>
                <p>
                  Over the years, FEMA has built an extensive video library. Yet, the American public still was not engaging with its mission or messages. The agency wanted and needed a more cohesive way of telling its story to ensure the core outcome — reaching and educating the American public on its roles and responsibilities — was met.
                </p>
              </div>
              <div>
                <h3>Solution</h3>
                <p>
                  Our team recognized the opportunity to provide clearer messaging and better brand consistency through video storytelling, expanding the reach and deepening engagement with core audiences on the great work FEMA does.
                </p>
              </div>
              <div>
                <h3>Results</h3>
                <p>
                  Bixal created a cohesive, branded multimedia template library and produced multiple high-impact, Section 508 compliant videos that showcase FEMA’s life-saving work as part of a broader effort to share their message on the agency’s role after disasters strike. Our collaborative work on the animated piece — “Building a Resilient Nation” — won a 2020 Bronze Telly Award.
                </p>
              </div>
            </div>

            <section class="bix-case-study__subsection">
              <div class="bix-emphasis-block bix-emphasis-block--accent-vivid">
                <p class="bix-emphasis-block__prefix">
                Highlight
                </p>

                <h4 class="bix-emphasis-block__title">#PartofSomethingBigger</h4>
                <div class="bix-emphasis-block__postfix">
                  From stakeholder interviews, the importance of their work generated the #PartofSomethingBigger theme. This theme was subsequently used to design the product and the corresponding copy and imagery displayed on HHS.gov/careers.
                </div>
              </div>
            </section>

            <section class="bix-case-study__subsection">
              <h2>Defining the problem</h2>
              <p>
                The American people expect a great deal from FEMA without fully understanding what the agency does and where lines of responsibility begin and end. The public is responsible for preparing themselves and their families for potential natural disasters. To do this, they can easily visit ready.gov, a government-supported website, for tips and educational materials. FEMA’s primary responsibility is to step in after a disaster. Because FEMA’s priority in times of crisis is to support survivors, providing clear messaging and establishing trust and credibility are vital to the agency’s success.
              </p>

              <h2>Discovery & Research</h2>
              <p>
                Through Bixal’s discovery process — a phase where teams conduct environmental scans, audience surveys and other research and discovery activities appropriate to a scope of work, given timeline and budget — our team learned that although FEMA has an extensive video library, the agency had difficulty creating consistency with the look, tone and feel of those videos and was struggling to create transparency and build brand trust through education and clear messaging. Some of the agency’s focus areas include providing public assistance programs to support communities in need, rebuilding infrastructure and roadways after disasters, funding grants for emergency response training and support, and keeping communities together.
              </p>

              <h2>Design & Approach</h2>
              <p>
                We chose to use animation in this piece to allow our team to explore a rich visual branding experience while using repeatable storytelling approaches new to the FEMA video portfolio. Our team recognized that visual storytelling, a proven way to capture the attention of, and engage, key audiences, could be the perfect way to spread FEMA’s message and connect with the American public.
              </p>


              <h2>Delivering the Solution</h2>
              <p>
                The Bixal team created both storytelling and multimedia templates for FEMA’s team to build on and ensure consistency with future use. We also aligned our project’s objectives with FEMA’s broader strategic communications goals to deliver a collection of videos that the FEMA team could integrate into ongoing marketing campaigns and relevant seasonal outreach (i.e., hurricane season). These videos now serve as a means for continued brand building and leverage other FEMA opportunities to promote greater agency awareness throughout the year.
              </p>

              <div class="bix-grid bix-grid--thirds">
                <div className="item">
                  <img src="${codeIcon}" alt="" height="75" width="75" />
                  <h3>Technology</h3>
                  <p>
                    Drupal 9, USAJOBS API, React.js, Leaflet Map API
                  </p>
                </div>
                <div className="item">
                  <img src="${supportIcon}" alt="" height="75" width="75" />
                  <h3>Methodology</h3>
                  <p>
                    We used Agile methodology and Scrum framework.
                  </p>
                </div>
                <div className="item">
                  <img src="${graphIcon}" alt="" height="75" width="75" />
                  <h3>Customer Support</h3>
                  <p>
                    To support customers, we developed a go-to-market project plan and social media toolkit for the product launch.
                  </p>
                </div>
              </div>

              <p>
                “Building a Resilient Nation” is the first in a series of short-format multimedia video pieces the Bixal team conceived, developed, produced and delivered for FEMA. We used the video as an opportunity to share not only FEMA’s mission but also their 2018-2022 Strategic Plan.
              </p>
            </section>
          </div>
        `,
      },
      {
        variant: "base",
        center_content: true,
        heading_type: "h2",
        prefix: "Impact",
        title: "A more consistent voice",
        description:
          "<p>Bixal’s team provided an improved approach to FEMA’s video library and assisted the agency in building a more consistent voice for their brand with more in-depth and engaging narratives.</p>",
      },
      {
        variant: "primary-alt",
        heading_type: "h2",
        prefix: "Conclusion",
        title:
          "An easier way for state and local partners to adhere to WIOA's provisions",
        description:
          "<p>Bixal’s work for ED and DOL made it much easier for state and local partners to adhere to WIOA's provisions, facilitated the creation of more and better career paths for all Americans, in particular those facing significant hurdles to employment, and demonstrated how well federal agencies can work for the people they serve when they lead with human-centered design and an ethos of constant improvement.</p>",
      },
    ],
  },
};

{
  /* <dl class="bix-description-list">
  <dt>Services</dt>
  <dd>Videography</dd>
  <dd>Content Strategy</dd>
  <dd>Branding Design</dd>
</dl> */
}

{
  /* <div class="bix-services">
  <div class="bix-emphasis-block">
    <p class="bix-emphasis-block__prefix">Services</p>
    <div class="bix-emphasis-block__title">Videography ∙ Content Strategy ∙ Branding Design</div>
  </div>
</div> */
}
