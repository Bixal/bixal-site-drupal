import { handleAutoplayVideos } from "./storybook-js/stories/_utils/videos.js";
/**
 * Handles loading storybook videos util for autoplay.
 * @file
 */

// Always use "use strict";
("use strict");

(function (Drupal, once) {
  Drupal.behaviors.uswdsGlobal = {
    attach: function (context) {
      const autoplay_videos = once(
        "video[autoplay]",
        context.querySelectorAll(["video[autoplay]"]),
      );
      if (autoplay_videos.length) {
        handleAutoplayVideos();
      }
    },
  };
})(Drupal, once);
