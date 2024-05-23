import ContractVehicles from "./contract-vehicles-landing.html.twig";

import * as Header from "../../components/header/header.stories";
import "../../components/hero/hero.stories";
import "../../components/contact-us/contact-us.stories";
import "../../components/footer/footer.stories";
import * as FooterContent from "../../components/footer/footer.stories";

export default {
  title: "Pages/Contract Vehicles/Landing",
  component: ContractVehicles,
};

export const Default = {
  args: {
    header: Header.default.args,
    hero: {
      variant: "image-bg",
      title: "Contract Vehicles",
      image: "/static/de1a4f3c509d3232e4d3be54522dac29/hero-contract-vehicles.jpg",
    },
    footerContent: FooterContent.default.args
  },
};
