import Prose from "./prose.html.twig";
import "./prose.scss";

export default {
  title: "Components/Typography/Prose",
  argTypes: {
    content: { control: "text" },
  },
  component: Prose,
};

export const Default = {
  args: {
    content: `
      <h2>Introduction</h2>
      <p>
        At Bixal, we employ a learner-driven approach to product creation, grounded in an Agile mindset that prioritizes meaningful outcomes over quick fixes. By integrating agility with our commitment to human-centered design (HCD) philosophy, we craft adaptable solutions that respond to real-time client feedback. This ensures government employees can acquire and apply new skills while navigating evolving policies, compliance requirements, and technological advancements. Our approach focuses on practical application and continuous improvement, empowering teams to thrive and learn in an ever-changing environment.
      </p>
      <blockquote>
        <p>
          Moving from static reports to actionable insights helps agencies deliver smarter, faster, and more efficient government services.
        </p>
      </blockquote>
      <p>
        Our Modern Responsiveness framework, a proprietary instructional design methodology, puts learners at the center by integrating HCD principles and the iterative nature of Agile. This approach ensures every solution we deliver is relevant, actionable, and immediately applicable to real-world challenges. Leveraging Agile allows us to help our clients adapt quickly in response to changing circumstances, providing timely and effective learning experiences that drive continuous growth and development.
      </p>
      <blockquote>
        <ul>
          <li>
            <strong>Research:</strong> Gaining a deep understanding of the problem, the
          audience, and the context.
          </li>
          <li>
            <strong>Design and Development:</strong> Conceptualizing and structuring the
          learning experience.
          </li>
          <li>
            <strong>Research:</strong> Implementing and scaling the solution to achieve
          measurable impact.
          </li>
          <li>
          <strong>Evaluation:</strong> Assessing the effectiveness of the solution and
          identifying areas for improvement.
          </li>
        </ul>
      </blockquote>
      <p>
        But how exactly does this learner-centered Modern Responsiveness approach sync with instructional design?
      </p>
      <h2>Traditional Instructional Design Frameworks</h2>
      <p>
        Depending on the project, learning teams might follow frameworks such as the ADDIE Model (Analysis, Design, Development, Implementation, Evaluation), the SAM approach (Successive Approximation Model), or Design Thinking for Training and Development. Each of these frameworks has unique strengths, and each can be successful when aligned with the right team and project goals. Our flexibility in selecting and adapting models allows us to create tailored solutions that align with the needs of our clients.
      </p>
      <blockquote>
        <p>
          It’s not about standing still and becoming safe. If anybody wants to keep
          creating they have to be about change.
        </p>
      </blockquote>
      <cite>—Miles Davis</cite>
      <p>
        When we break down these methodologies into high-level categories, we typically see four core stages emerge:
      </p>
      <ul>
        <li>
          <strong>Research:</strong> Gaining a deep understanding of the problem, the audience, and the context.
        </li>
        <li>
          <strong>Design and Development:</strong> Conceptualizing and structuring the learning experience.
        </li>
        <li>
          <strong>Research:</strong> Implementing and scaling the solution to achieve measurable impact.
        </li>
        <li>
          <strong>Evaluation:</strong> Assessing the effectiveness of the solution and identifying areas for improvement.
        </li>
      </ul>
      <h2>Where Traditional Methods Fall Short</h2>
      <p>
        In our experience, traditional instructional design frameworks often stagnate during the research, design, and development phases. The desire to craft a perfect solution can lead to extended deliberations on whether enough research has been conducted or which design option is the most appropriate.
      </p>
      <p>
        The problem with that is every moment stuck in these phases is time that the learning solutions aren’t supporting learners or even soliciting their feedback. Our Modern Responsiveness approach addresses this by embedding an iteration stage that generally begins during the research phase. This rapid prototyping allows for early and often testing and improvement, which ultimately allows us to shorten the time-to-delivery (or rather, time-to-impact) and ensure we are refining the solution based on stakeholder feedback (i.e., delivering something people actually need).
      </p>
      <h2>Modern Responsiveness: Our Commitment to Continuous Improvement</h2>
      <p>
        Modern Responsiveness is Bixal’s approach to breaking free from traditional phase constraints and embracing a more fluid, flexible, and dynamic workflow. This allows us to adapt and move forward without compromising quality.
      </p>
      <p>
        Key aspects of our Modern Responsiveness approach include:
      </p>
      <ul>
        <li>
          <strong>Iterative idea generation:</strong> We don’t wait to generate design ideas until the research phase is complete. Instead, we continuously sketch solutions, draw from past projects, and identify relevant artifacts to inform our work. This approach fosters creativity and efficiency, ensuring we always move forward and drive towards results.
        </li>
        <li>
          <strong>Early and frequent feedback:</strong> We engage subject matter experts and stakeholders throughout the process, incorporating their insights and ideas as they emerge. By maintaining an open flow of communication and incorporating new ideas as they emerge, we ensure that the final product is both innovative and aligned with the client’s goals.</li>
        <li>
          <strong>Continuous progress over perfection:</strong> We prioritize steady forward movement, allowing our research, design, iteration, and evaluation phases to overlap and inform one another. This creates a dynamic, structured, and flexible workflow.
        </li>
      </ul>
      <p>
        The core aspect of our strategy—an integrated ideate/create/validate phase—emphasizes the creation of a minimal viable product (MVP). The MVP is quickly developed to allow for iterative refinements based on stakeholder feedback. This continuous feedback loop and refinement ensures the MVP evolves over time, integrating fresh insights and innovations while actively involving stakeholders. This ongoing collaboration allows for immediate adjustments based on firsthand user feedback, ensuring that updates are aligned with user needs and expectations. This method of iterative updates differs from traditional processes that often rely on a singular delivery phase following prolonged periods of development.
      </p>
      <p>
        By adhering to these stages, we produce functional, learner-centered products without straying from Agile principles. This approach allows us to stay flexible, continuously improve, and rapidly deliver solutions that genuinely meet user needs.
      </p>
      <h2>Agile Instructional Design in Action</h2>
      <p>
        As an example of how this works in practice, while conducting initial research on a project we worked on for a federal agency, we identified potential design elements and content themes for product management modules for a group of IT leaders. This led to helpful feedback during an exploratory meeting. Based on this early input, we immediately created initial prototypes and mockups and had them validated by SMEs, stakeholders, and end-learners. This iterative process allowed us to refine our solutions and incorporate real-time feedback. As a result, we increased our ability to progress and over deliver.
      </p>
      <h2>Conclusion: Agile Instructional Design</h2>
      <p>
        Bixal’s Modern Responsiveness approach embraces change and drives exceptional results as project demands and stakeholder expectations evolve. By overlapping traditional phases of work, we foster a culture of continuous feedback that keeps our team adaptable and effective. This strategy enables us to create impactful learning solutions that are both transformative and flexible. Our focus on collaboration, iterative progress, and rapid responsiveness to new information allows us to consistently exceed expectations. The result is learning experiences that meet real-world client needs, delivering value and relevance today and into the future.
      </p>`,
  },
};
