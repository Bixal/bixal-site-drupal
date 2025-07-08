import "./homepage.scss";

import Homepage from "./homepage.html.twig";

import HeaderContent from "../../components/header/header.content.json";
// import DescriptionListCollectionContent from "../../components/description-list/description-list-collection.content.json";

import "../../components/header/header.stories";
import * as QuickFacts from "../../components/quick-fact/quick-fact.stories";
import "../../components/section/section.stories";
import "../../components/button/button.stories";
import "../../components/hero/hero.stories";
import "../../components/cards/cards.stories";

import HeroImage from "../../assets/static/Bixal Corp Header Banner.png";
import WorkWithUsImage from "../../assets/static/Bixal Corp Work With Us.png";
import SBALogo from "../../assets/static/SBA-Logo-Stacked-Reverse-RGB.svg";

import * as GraphicListContent from "../../components/graphic-list/graphic-list.stories";

import "../../components/description-list/description-list.stories";
// import * as ContactUs from "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import * as FooterContent from "../../components/footer/footer.stories";

export default {
  title: "Pages/Homepage",
  component: Homepage,
};

export const Default = {
  args: {
    header: HeaderContent,
    hero: {
      variant: "primary",
      image: HeroImage,
      prefix: "Smart solutions. Lean Delivery. Real Impact.",
      title: "We Help Government Agencies Deliver",
      heading_type: "h1",
      description: `
        <p>Federal agencies turn to us when they need to move fast, reduce complexity, and deliver services the public can use and trust.
        </p>
        <p>Whether it's Al readiness, content strategy, data modernization, or service delivery, we bring clarity, structure, and speed to move missions forward.</p>
      `,
      cta: {
        label: "See how we help federal teams",
        variant: "inverse",
      },
    },
    facts: {
      ...QuickFacts.CollectionThirds.args,
    },
    whoWeAre: {
      prefix: "Who we are",
      variant: "base",
      title:
        "Bixal Is A Diverse Group Of Strategists, Designers, Engineers, And Thinkers.",
      description:
        "<p>Our common belief is that everyone has the right to an effective government. Every day, we come to work focused on helping our federal partners deliver a better customer experience to the American public and communities around the world. We value kindness, humility, and collaboration. Our culture is felt the moment you walk in the door, and it is reflected across our entire team.</p>",
    },
    expertise: {
      title: "Our Expertise",
      description:
        "<p>We partner with agencies to solve today’s challenges, scale what works, and build the capacity to stay ready for what’s next.</p><br />",
      disciplines: GraphicListContent.Background.args,
      cta: {
        label: "Check out our results",
        // variant: "inverse",
        // icon: "arrow-right",
        href: "#",
      },
    },
    choose: {
      variant: "primary",
      image: "",
      title: "Why Government Agencies Choose Bixal",
      description: `
        <ul>
          <li>Proven results across 20+ federal agencies</li>
          <li>On multiple federal contract vehicles for faster onboarding</li>
          <li>Seamless integration with your systems and teams</li>
          <li>Immediate fixes combined with long-term capacity building</li>
          <li>Small-business agility with federal-scale impact</li>
        </ul>
        <div class="logo-grid">
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
          <div className="logo-grid__item"><img src="${SBALogo}" alt="" width="75" /></div>
        </div>
      `,
      cta: {
        variant: "inverse",
        label: "See our contract vehicles",
        href: "#",
      },
    },
    workWithUs: {
      // center_content: true,
      image: WorkWithUsImage,
      title: "Let's Work Together",
      description:
        "We're ready to meet you where you are and deliver forward-ready solutions—faster onboarding, leaner operations, and services the public can trust.",
      cta: {
        label: "Contact Us",
        href: "#",
      },
    },
    // This will need to be refactored or removed since Contact is simplified.
    // contactContent: ContactUs.default.args,
    footerContent: FooterContent.default.args,
  },
};
