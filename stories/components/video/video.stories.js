import Video from "./video.html.twig";
import "./video.scss";

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
