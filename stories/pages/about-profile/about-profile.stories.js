import AboutProfile from "./about-profile.html.twig";

import * as Header from "../../components/header/header.stories";
import * as Profile from "../../components/profile/profile.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import * as FooterContent from "../../components/footer/footer.stories";

export default {
  title: "Pages/About/Profile",
  component: AboutProfile,
};

export const Default = {
  args: {
    header: Header.default.args,
    profile: Profile.default.args,
    footerContent: FooterContent.default.args,
  },
};
