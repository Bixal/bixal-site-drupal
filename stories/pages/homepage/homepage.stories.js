import Homepage from "./homepage.html.twig";

import HeaderContent from "../../components/header/header.content.json";
import FlipCardContent from "../../components/cards/flip-card.content.json";
import DescriptionListCollectionContent from "../../components/description-list/description-list-collection.content.json";

import "../../components/header/header.stories";
import "../../components/section/section.stories";
import "../../components/button/button.stories";
import "../../components/hero/hero.stories";
import "../../components/cards/cards.stories";
import "../../components/description-list/description-list.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import * as SocialNav from "../../components/social-nav/social-nav.stories";

export default {
  title: "Pages/Homepage",
  component: Homepage,
};

export const Default = {
  args: {
    header: HeaderContent,
    hero: {
      variant: "image-inline",
      image:
        "https://www.bixal.com/static/5fe5ae2fa9f9bc458b9dd0914c0b1c9a/ce7bb/img-b-hero-7.webp",
      title: "This is Bixal.",
      description:
        "A mission-driven organization determined to improve people’s lives through human-centered strategies and transformative technologies. We deliver on this promise by partnering with leading federal agencies to conceive and create powerful data-driven customer experiences.",
    },
    whoWeAre: {
      prefix: "Who we are",
      title:
        "Bixal is a diverse group of strategists, designers, engineers, and thinkers.",
      description:
        "<p>Our common belief is that everyone has the right to an effective government. Every day, we come to work focused on helping our federal partners deliver a better customer experience to the American public and communities around the world. We value kindness, humility, and collaboration. Our culture is felt the moment you walk in the door, and it is reflected across our entire team.</p>",
    },
    whatWeDo: {
      variant: "primary",
      image:
        "https://www.bixal.com/static/img-whatwedo-e68b3d20abd32c896d56b122063f7664.jpg",
      prefix: "What we do",
      title:
        "The work we do helps our clients unite stakeholders, optimize resources, and better serve citizens all over the world.",
      description:
        "<p>We take a people-absolutely-first approach to solving complex organizational challenges and gracefully balance cutting-edge technical chops with a deep sense of empathy and understanding. We relentlessly focus on outcomes and weave it all together with a unique agility that permeates across everything we do.</p>",
      cta: {
        label: "Explore case studies",
        variant: "inverse",
        icon: "arrow-right",
        href: "#",
      },
    },
    flipCards: FlipCardContent,
    clientsAndPartners: {
      prefix: "Our clients and partners",
      title:
        "We work with leading government agencies and organizations who seek to create real change.",
      collections: DescriptionListCollectionContent,
    },
    workWithUs: {
      variant: "tall",
      center_content: true,
      image:
        "https://www.bixal.com/static/img-careers-269d29ea5a43482c6c0b920bdd5e9d87.jpg",
      prefix: "Work with us",
      title:
        "Bixal is filled with incredibly smart, creative, and passionate people. If you’re interested in joining our team, drop us a line or check out our careers page.",
      cta: {
        label: "Join our team",
        href: "#",
        icon: "arrow-right",
      },
    },
    socialNav: SocialNav.default.args
  },
};
