import AboutProfile from "./about-profile.html.twig";

import * as Header from "../../components/header/header.stories";
import * as Profile from "../../components/profile/profile.stories";
import * as SocialNav from "../../components/social-nav/social-nav.stories";

export default {
  title: "Pages/About/Profile",
  component: AboutProfile,
};

export const Default = {
  args: {
    header: Header.default.args,
    profile: Profile.default.args,
    socialNav: SocialNav.default.args
  },
};
