import Video from "./video.html.twig";
import "./video.scss";
import { handleAutoplayVideos } from "../../_utils/videos";

// Initialize video accessibility for Storybook
window.addEventListener("DOMContentLoaded", () => {
  handleAutoplayVideos();
});

// import infoIcon from "@uswds/uswds/img/usa-icons/info_outline.svg";

export default {
  title: "Components/Video",
  tags: ["autodocs"],
  component: Video,
  args: {
    video_src:
      "https://www.bixal.com/sites/default/files/2024-08/bixal-careers-story-2024-07-20%20at%2020.31.29_0.webm",
  },
};

export const Default = {
  args: {
    description: "A video demoing Bixal's storybookJS implementation.",
  },
};

export const EmptyVideo = {
  args: {
    video_src: null,
  },
};

export const Centered = {
  args: {
    center_content: true,
    description: "Centering description.",
  },
};

export const Poster = {
  args: {
    poster:
      "https://www.bixal.com/sites/default/files/2024-10/HOLIDAY%20SPECIAL%20banner%202.gif",
  },
};

export const HiddenControls = {
  args: {
    controls: false,
  },
};

export const DecorativeVideo = {
  args: {
    video_src: "/static/hero/B_Video.webm",
    decorative_video: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '**Note:** For accessibility and user experience, decorative videos should be **5 seconds or less**. Videos are automatically paused for those who have enabled "Reduce Motion" in their system preferences.',
      },
    },
  },
};
