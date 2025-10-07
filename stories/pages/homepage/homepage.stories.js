import Homepage from "./homepage.html.twig";

import HeaderContent from "../../components/header/header.content.json";
import DescriptionListCollectionContent from "../../components/description-list/description-list-collection.content.json";

import "../../components/header/header.stories";
import "../../components/section/section.stories";
import "../../components/button/button.stories";
import "../../components/hero/hero.stories";
import "../../components/cards/cards.stories";

import * as GraphicListContent from "../../components/graphic-list/graphic-list.stories";

import "../../components/description-list/description-list.stories";
import * as ContactUs from "../../components/contact-us/contact-us.stories";
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
      variant: "image-inline",
      image:
        "https://www.bixal.com/sites/default/files/2025-04/Bixal%20Hero%20Image-opt.webp",
      title: "This is Bixal.",
      description:
        "A mission-driven organization determined to improve people’s lives through human-centered strategies and transformative technologies. We deliver on this promise by partnering with leading federal agencies to conceive and create powerful data-driven customer experiences.",
    },
    whoWeAre: {
      prefix: "Who we are",
      variant: "base",
      title:
        "Bixal is a diverse group of strategists, designers, engineers, and thinkers.",
      description:
        "<p>Our common belief is that everyone has the right to an effective government. Every day, we come to work focused on helping our federal partners deliver a better customer experience to the American public and communities around the world. We value kindness, humility, and collaboration. Our culture is felt the moment you walk in the door, and it is reflected across our entire team.</p>",
    },
    expertise: {
      prefix: "Our expertise",
      title:
        "We provide federal agencies with integrated, outcome-driven solutions across five core disciplines:",
      disciplines: GraphicListContent.default.args,
    },
    whatWeDo: {
      variant: "primary",
      image:
        "https://www.bixal.com/sites/default/files/2025-04/What%20We%20Do%20Banner.webp",
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
    coreServices: {
      center_content: true,
      variant: "base",
      title:
        "Government agencies can work with us through several contract vehicles, which are designed to provide an efficient and effective way to procure a range of services.",
      cta: {
        label: "View our contract vehicles",
        href: "#",
        icon: "arrow-right",
      },
    },
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
        "https://www.bixal.com/sites/default/files/2025-04/Work%20With%20Us.webp",
      prefix: "Work with us",
      title:
        "Bixal is filled with incredibly smart, creative, and passionate people. If you’re interested in joining our team, drop us a line or check out our careers page.",
      cta: {
        label: "Join our team",
        href: "#",
        icon: "arrow-right",
      },
    },
    contactContent: ContactUs.default.args,
    footerContent: FooterContent.default.args,
  },
};
