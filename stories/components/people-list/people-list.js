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
  const viewAllButton = document.querySelector('.bix-people__footer').children[0];

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
    const chosenFilterValue = option.getAttribute("for");

    // @TODO: Check for scrollbar and adjust body padding to avoid screen "shake" when there are zero items.
    [...filterItems].map(person => {
      const bixalersFilterCategory = person.dataset.filterCategory.split('|||');
      person.removeAttribute("hidden");
      if (chosenFilterValue === "all") {
        return;
      }
      // @TODO: Add transitions for filtering.
      for (let key in bixalersFilterCategory) {
        if (bixalersFilterCategory[key] === chosenFilterValue) {
          person.removeAttribute("hidden");
          return;
        }
      }
      person.setAttribute("hidden", "");
    });
  }

  /**
   * Remove content number limit.
   *
   * @param {Event} event
   */
  function removeContentLimit(event) {
    const hiddenExtraItems = document.querySelectorAll(".view-all-only");
    [...hiddenExtraItems].map(person => {
      person.classList.remove('view-all-only');
    });
    document.querySelector('.bix-people__footer').setAttribute("hidden", "");
  }

  /**
   * Hides menu initially and then uses Toggle utility to show/hide.
   */
  function init() {
    target.setAttribute("hidden", "");

    trigger.addEventListener("click", Toggle.toggle);
    target.addEventListener("click", filterContent);
    viewAllButton.addEventListener("click", removeContentLimit);
  }

  init();
})
