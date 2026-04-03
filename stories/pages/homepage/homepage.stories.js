import Homepage from "./homepage.html.twig";

import HeaderContent from "../../components/header/header.content.json";
import DescriptionListCollectionContent from "../../components/description-list/description-list-collection.content.json";

import "../../components/header/header.stories";
import * as Section from "../../components/section/section.stories";
import "../../components/button/button.stories";
import * as Hero from "../../components/hero/hero.stories";
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
    hero: Hero.SplitRightVideo.args,
    whoWeAre: {
      ...Section.default.args,
      variant: "base",
    },
    expertise: {
      prefix: "Our expertise",
      title:
        "We provide federal agencies with integrated, outcome-driven solutions across five core disciplines:",
      disciplines: GraphicListContent.default.args,
    },
    whatWeDo: Section.BackgroundImage.args,
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
    workWithUs: Section.Tall.args,
    contactContent: ContactUs.default.args,
    footerContent: FooterContent.default.args,
  },
};
