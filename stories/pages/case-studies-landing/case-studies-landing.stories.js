import CaseStudiesLanding from "./case-studies-landing.html.twig";

import * as Header from "../../components/header/header.stories";
import "../../components/hero/hero.stories";
import * as Blurb from "../../components/blurb/blurb.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import * as SocialNav from "../../components/social-nav/social-nav.stories";

export default {
  title: "Pages/Case Studies/Landing",
  component: CaseStudiesLanding,
};

export const Default = {
  args: {
    header: Header.default.args,
    hero: {
      variant: "image-bg",
      title: "Our Work",
      image: "https://www.bixal.com/static/0a66c21e57fc6b5c25b6a4b9055bf84f/landing-hero.jpg",
    },
    intro: {
      title: "What we do",
      description: "<p>At Bixal, we lead human-centered digital transformation and global solutions that drive equity, sustainability and social good. We leverage technology, communications, data and human-centered design to help governments and organizations be more efficient, effective and impactful. Read on to learn more about the broad scope of our work and how we support our clients to provide a better customer experience and, ultimately, improve the lives of the people they serve.</p>",
    },
    blurbs: Blurb.BlurbCollectionFeatured.args,
    socialNav: SocialNav.default.args
  },
};
