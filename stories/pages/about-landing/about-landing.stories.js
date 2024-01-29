import AboutLanding from "./about-landing.html.twig";
import * as Header from "../../components/header/header.stories";
import * as PeopleList from "../../components/people-list/people-list.stories";
import * as SocialNav from "../../components/social-nav/social-nav.stories";

export default {
  title: "Pages/About/Landing",
  component: AboutLanding,
};

export const Default = {
  args: {
    header: Header.default.args,
    hero: {
      variant: "image-bg",
      title: "About",
      image: "https://www.bixal.com/static/df25839ca7f45345855137cf81046892/about--hero.jpg",
    },
    intro: {
      title: "Bixal is a mission-driven organization determined to have a positive impact on the lives of people everywhere.",
      description: "<p>We do this by partnering with leading federal agencies to conceive and create powerful data-driven customer experiences to better serve the American public and communities around the world.</p><p>Bixal is more than an organization. Bixal is a methodology. It’s a people-absolutely-first approach to solving complex organizational challenges, balancing cutting-edge technical chops with a deep sense of empathy and understanding.</p>",
    },
    bixalers: {
      variant: "image-bg",
      additional_classes: "bix-section--tall",
      image: "https://www.bixal.com/static/59f4525c9919bfa346d4f9cf50f1070a/5e5f3/about--b-banner.webp",
    },
    people: PeopleList.default.args,
    socialNav: SocialNav.default.args
  },
};
