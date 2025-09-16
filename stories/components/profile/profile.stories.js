import Profile from "./profile.html.twig";

import ProfileContent from "./profile.content.json";
import * as SocialNav from "../social-nav/social-nav.stories";

import "./profile.scss";

export default {
  title: "Components/Profile",
  component: Profile,
  args: {
    socialNav: SocialNav.default,
    ...ProfileContent,
  },
};

export const Default = {};
