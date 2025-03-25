import * as Toggle from "../../_utils/toggle.js";

window.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector("[data-dropdown-toggle]");

  if (!trigger) {
    return;
  }

  const target = document.getElementById(trigger.getAttribute("aria-controls"));
  const filterItems = document.querySelectorAll(".bix-person");

  if (!filterItems) {
    return;
  }

  const footer = document.querySelector(".bix-people__footer");

  /**
   * Basic content filtering.
   *
   * @param {Event} event
   */
  function filterContent(event) {
    const isOption = event.target.classList.contains(
      "bix-filter__dropdown-option",
    );

    // Avoids having to set an even listener on *every* option.
    if (!isOption) {
      return;
    }
    // After a filter is chosen, hide the popup.
    Toggle.hide(trigger, target);
    // If a filter is chosen, show all results and hide the 'view all' button.
    removeContentLimit();

    const option = event.target;
    const chosenFilterValue = option.getAttribute("for");

    // @TODO: Check for scrollbar and adjust body padding to avoid screen "shake" when there are zero items.
    [...filterItems].map((person) => {
      const bixalersFilterCategory = person.dataset.filterCategory.split("|||");
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
   */
  function removeContentLimit() {
    const footer = document.querySelector(".bix-people__footer");
    if (!footer) {
      return;
    }
    const style = window.getComputedStyle(footer);
    if (style.visibility === "hidden") {
      return;
    }
    const hiddenExtraItems = document.querySelectorAll(".view-all-only");
    [...hiddenExtraItems].map((person) => {
      person.classList.remove("view-all-only");
    });
    footer.setAttribute("hidden", "");
  }

  function toggleDropdown(event) {
    Toggle.toggle(event);

    if (!Toggle.isActive) {
      const selectedItem = target.querySelector('input[type="radio"]:checked');
      selectedItem.focus();
      return;
    }

    trigger.focus();
  }

  /**
   * Hides menu initially and then uses Toggle utility to show/hide.
   */
  function init() {
    target.setAttribute("hidden", "");

    document.addEventListener("keydown", (event) => {
      const hasChildFocus = target.contains(document.activeElement);

      if (
        (event.key === "Escape" && !target.hasAttribute("hidden")) ||
        !hasChildFocus
      ) {
        Toggle.hide(trigger, target);
      }
    });

    trigger.addEventListener("click", toggleDropdown);
    target.addEventListener("click", filterContent);

    // Add a click event to the 'View All' button.
    if (footer) {
      footer.children[0].addEventListener("click", removeContentLimit);
    }
  }

  init();
});
