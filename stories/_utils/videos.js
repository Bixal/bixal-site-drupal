/**
 * Video utility functions.
 */

/**
 * Accessible videos.
 *
 * Pauses autoplay videos if the user has "prefers-reduced-motion" enabled.
 *
 * Matches WCAG 2.1 Guideline 2.3.3: Animation from Interactions (Level AAA) and 2.2.2: Pause, Stop, Hide (Level A).
 * @see https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
 * @see https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html
 */
function handleAutoplayVideos() {
  let reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoPlayVideos = document.querySelectorAll("video[autoplay]");

  if (reducedMotion) {
    autoPlayVideos.forEach((video) => {
      video.pause();
      video.controls = true;
    });
  }
}

export { handleAutoplayVideos };
