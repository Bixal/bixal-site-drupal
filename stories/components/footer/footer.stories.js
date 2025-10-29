import Footer from "./footer.html.twig";
import Button from "../button/button.html.twig";

import "./footer.scss";
import "../button/button.scss";
import "../section/section.scss";

import * as SocialNav from "../social-nav/social-nav.stories";

export default {
  title: "Components/Footer",
  component: Footer,
  args: {
    logo: {
      src: "/static/img-b-footer.png",
      alt: "Bixal Logo letter B silhouette around a photo of a smiling child"
    },
    columns: [
      {
        title: "Work with us",
        body: `
          <p>Looking to join our team? Check out our openings.</p>
          <p>
            ${Button({
                variant: "inverse",
                label: "Learn more",
                href: "/careers",
                icon: "arrow-right",
              })}
          </p>
        `
      },
      {
        title: "Headquarters",
        body: `
          <address>
            3050 Chain Bridge Rd., Suite 305<br>Fairfax, VA 22030
          </address>
          <p>
            <a href="tel:1.703.634.5701">703.634.5701</a>
            <a href="mailto:info@bixal.com">info@bixal.com</a>
          </p>
        `
      },
      {
        title: "Accreditations",
        body: `
        <ul>
          <li>
            <a
              href="https://www.sba.gov/business-guide/grow-your-business/women-owned-businesses"
              rel="noopener noreferrer"
              target="_blank"
            >
              Women-owned small business
            </a>
          </li>
          <li>
            <a
              href="https://www.iso.org/standard/62085.html"
              rel="noopener noreferrer"
              target="_blank"
            >
              ISO 9001:2015
            </a>
          </li>
          <li>
            <a
              href="https://cmmiinstitute.com/learning/appraisals/levels"
              rel="noopener noreferrer"
              target="_blank"
            >
              CMMI Level 3
            </a>
        </li>
        <div class="accreditations-logos">
          <img src="/static/7110e309c7dc3b7c2aa59397bde3793a/iso-certified.svg" alt="ISO certified logo">
          <img width="100" src="/static/cmmi-maturity-level-3-color-small.png" alt="Capability Maturity Model Integration Level 3 logo">
          <img width="75" alt="Drupal Certified Bronze Partner" src="https://www.bixal.com/sites/default/files/accreditations/association_certified_bronze_badge.svg">
        </div>
      </ul>`
      },
    ],
    siteNav: [
      {
        label: "Our work",
        href: "#"
      },
      {
        label: "Contract vehicles",
        href: "#"
      },
      {
        label: "Careers",
        href: "#"
      },
      {
        label: "Blog",
        href: "#"
      },
      {
        label: "About Bixal",
        href: "#"
      },
    ],
    legalNav: [
      {
        label: "Accessibility Statement",
        href: "#"
      },
      {
        label: "Privacy Policy",
        href: "#"
      },
    ],
    socialNav: {
      ...SocialNav.default.args,
      aria_label: "Bixal social links",
    },
  },
};

export const Default = {};

export const WithoutSiteNav = {
  args: {
    ...Default.args,
    siteNav: null
  }
};
