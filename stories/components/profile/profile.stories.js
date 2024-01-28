import Profile from "./profile.html.twig";

import "../social-nav/social-nav.content.json";
import "../social-nav/social-nav.stories";

import "./profile.scss";

export default {
  title: "Components/Profile",
  component: Profile,
  args: {
    socialNav: {
      variant: "accent-warm",
      items: [
        {
          "href": "https://www.linkedIn.com",
          "label": "LinkedIn"
        }
      ]
    }
  }
};

export const Default = {};
