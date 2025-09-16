import SocialNav from "./social-nav.html.twig";

// Icons
import SocialNavContent from "./social-nav.content.json";

import "./social-nav.scss";

export default {
  title: "Components/Social nav",
  tags: ["autodocs"],
  component: SocialNav,
  args: SocialNavContent,
};

export const Default = {};

export const AccentWarm = {
  args: {
    variant: "accent-warm",
  },
};

export const Inverse = {
  args: {
    variant: "inverse",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
