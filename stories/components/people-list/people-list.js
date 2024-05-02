import * as Toggle from "../../_utils/toggle.js";

window.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector("[data-dropdown-toggle]");
  if (!trigger) {
    return;
  }
  const target = document.getElementById(trigger.getAttribute("aria-controls"));
  // const filterOptions = target.querySelectorAll(".bix-filter__dropdown-option");
  const filterItems = document.querySelectorAll(".bix-person");
  if (!filterItems) {
    return;
  }

  /**
   * Basic content filtering.
   *
   * @param {Event} event
   */
  function filterContent(event) {
    const isOption = event.target.classList.contains("bix-filter__dropdown-option");

    // Avoids having to set an even listener on *every* option.
    if (!isOption) {
      return;
    }

    const option = event.target;
    const filterValue = option.getAttribute("for");

    // @TODO: Check for scrollbar and adjust body padding to avoid screen "shake" when there are zero items.
    [...filterItems].map(person => {
      const contentItemFilter = person.dataset.filterCategory;
      person.removeAttribute("hidden");

      // @TODO: Add transitions for filtering.
      if (filterValue !== "all" && contentItemFilter !== filterValue) {
        person.setAttribute("hidden", "");
      }
    });
  }

  /**
   * Hides menu initially and then uses Toggle utility to show/hide.
   */
  function init() {
    target.setAttribute("hidden", "");

    trigger.addEventListener("click", Toggle.toggle);
    target.addEventListener("click", filterContent);
  }

  init();
})
