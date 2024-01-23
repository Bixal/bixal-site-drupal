import * as Toggle from "../../_utils/toggle";

window.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector("[data-dropdown-toggle]");
  const target = document.getElementById(trigger.getAttribute("aria-controls"));

  /**
   * Hides menu initially and then uses Toggle utility to show/hide.
   */
  function init() {
    target.setAttribute("hidden", "");

    trigger.addEventListener("click", Toggle.toggle);
  }

  init();
})
