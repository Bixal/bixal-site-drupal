import Careers from "./careers.html.twig";

export default {
  title: "Pages/Careers",
  component: Careers,
};

import HeaderContent from "../../components/header/header.content.json";
import EmphasisBlockCollectionContent from "../../components/emphasis-block/emphasis-block-collection.content.json";

import "../base/base.stories";
import "../../components/blurb/blurb.stories";
import "../../components/emphasis-block/emphasis-block.stories";

import * as SocialNav from "../../components/social-nav/social-nav.stories";

// @TODO: Hero images should be webp.
export const Default = {
  args: {
    header: HeaderContent,
    hero: {
      variant: "image-bg",
      title: "Careers",
      image:
        "https://www.bixal.com/static/72fb0e52a06fe7d036d793de33f62208/careers-hero.jpg",
    },
    intro: {
      title: "How can you improve the lives of people today?",
      description:
        "<p>Bixal's diverse and talented team has led the digital transformation of some of the most influential organizations in the world and brings unparalleled experience and energy into every one of our engagements. Our team of supportive professionals thrive on challenge and hold themselves and their work to a higher standard.</p><p>Come work with us.</p>",
    },
    imageSection: {
      variant: "image-bg",
      image:
        "https://www.bixal.com/static/5fbc59878f4c5e250d2f7efbb18a71a9/45909/careers--b-banner.webp",
    },
    blurbs: {
      variant: "three-up",
      blurbs: [
        {
          image:
            "https://www.bixal.com/static/d6e70f1bae8881758dd9b06d3fd77607/56d27/careers--thought-leaders.webp",
          title: "Thought leaders",
          description:
            "Bixal's team members are constant learners and teachers, supportive of individual and professional growth. We value kindness and humility and seek to build each other up and drive everyone forward.",
        },
        {
          image:
            "https://www.bixal.com/static/dcaf9d4d8975930ba8811afd2c14d333/95694/careers--collaborative-and-agile.webp",
          title: "Collaborative & Agile",
          description:
            "We relentlessly focus on outcomes and weave it together with a unique agility that permeates everything we do. Bixal values collaboration and transparency. It shapes how we approach every project.",
        },
        {
          image:
            "https://www.bixal.com/static/1d156602b6729216b92caa6707ea9ace/56d27/careers--empowered-teams.webp",
          title: "Empowered Teams",
          description:
            "Bixal unites different people with different perspectives from all over the world and provides them with an open, empowered environment where creativity can flourish.",
        },
      ],
    },
    joinSection: {
      variant: "image-bg",
      image:
        "https://www.bixal.com/static/careers--join-our-team-bc7de974c21a020765a582d498089923.jpg",
      title: "Join Our Team",
      description:
        "<p>We are focused on working with federal clients to deliver on their mission to leave a positive impact on the lives of people everywhere. Headquartered in Fairfax, VA, our talent is located in Washington, DC, Richmond, VA, Baltimore, MD, Atlanta, GA, and other remote locations.</p>",
      cta: {
        href: "javascript:void(0)",
        label: "View all jobs",
        has_icon: true,
      },
    },
    featuredJobs: {
      blocks: EmphasisBlockCollectionContent,
    },
    socialNav: SocialNav.default.args
  },
};
