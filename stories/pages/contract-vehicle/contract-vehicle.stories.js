import ContractVehicle from "./contract-vehicle.html.twig";

import * as Header from "../../components/header/header.stories";
import * as ContactUs from "../../components/contact-us/contact-us.stories";
import * as FooterContent from "../../components/footer/footer.stories";

export default {
  title: "Pages/Contract Vehicles/Contract Vehicle",
  component: ContractVehicle,
  args: {
    header: Header.default.args,
    sections: [
      {
        heading_type: "h1",
        title: "General overview",
        body: `
          <h2 class="bix-section__title">Introduction</h2>
          <p>Bixal is the sole holder of a blanket purchase agreement (BPA) providing independent monitoring and evaluation (M&E) services in support of the U.S. Department of the Treasury’s Office of Technical Assistance (OTA). With over 90 technical assistance projects in 51 developing and transitional countries around the globe, the OTA works with finance ministries and central banks to safeguard financial sectors and strengthen their ability to manage public finances effectively. M&E services under this BPA include designing and conducting evaluations of OTA initiatives, supporting M&E process improvements and facilitating program learning.</p><p>This three-year BPA builds on Bixal’s M&E capabilities, which were significantly augmented in January 2021, when we acquired Clear Outcomes. As Bixal furthers our data science and analytics practice area, we also continue to enhance our M&E services by integrating them with our transformational technology and data-driven capabilities.</p>
          <h2 class="bix-section__title">Marketing materials</h2>
          <ul>
            <li>
              <a href="javascript:void(0)">Bixal COVID-19 Service Offerings GSA OASIS (PDF)
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">Bixal General Capabilities (PDF)
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">Bixal International Capabilities (PDF)
              </a>
            </li>
          </ul>
          <h2 class="bix-section__title">Contractor Capabilities</h2>
          <p>As prime contractor, Bixal offers a global perspective to help federal agencies identify their needs and create systems that support business objectives with the customer in mind.</p><p>Bixal leverages agile methodologies that align with our commitment to exceptional service, ensuring the delivery of value, quality, and security. Our core capabilities suited specifically for the USDA IDIQ vehicle include:
          </p>
          <ul>
            <li>
              Enterprise Digital Communications & Technology
            </li>
            <li>
              Content Strategy & Marketing Advanced Brand Recognition
            </li>
          </ul>
          <h2 class="bix-section__title">Key points of Contact</h2>
          <p>To contact us for information on the USDA IDIQ vehicle, please use the following contact information:</p><address><b>Fred Jorgensen, VP of Strategic Growth</b><br /><a href="javascript:void(0)">fred.jorgensen@bixal.com</a><br /><a href="javascript:void(0)">703.634.5701</a></address><address><b>Fred Jorgensen, VP of Strategic Growth</b><br /><a href="javascript:void(0)">fred.jorgensen@bixal.com</a><br /><a href="javascript:void(0)">703.634.5701</a></address>


          <h2 className="bix-section__title">
            Conformed Contract Documents
          </h2>
          <ul>
          <li>
          <a href="javascript:void(0)">OASIS SB Contract (Pool 1)</a>
          </li>
          <li>
          <a href="javascript:void(0)">OASIS 8(a) Contract (SubPool 1)</a>
          </li>
          </ul>
          <h2 className="bix-section__title">
            Contract information
          </h2>
          <h3>OASIS SB</h3>
          <ul>
            <li>Contract Number: 47QRAD20D1074</li>
            <li>DUNS Number: 100128086</li>
            <li>CAGE Code: 4QRJ3</li>
          </ul>
          <h3>OASIS 8(a)</h3>
          <ul>
            <li>Contract Number: 47QRAD20D1074</li>
            <li>DUNS Number: 100128086</li>
            <li>CAGE Code: 4QRJ3</li>
          </ul>
        `,
      },
    ],
    contactContent: ContactUs.default.args,
    footerContent: FooterContent.default.args,
  },
};

export const Default = {};
