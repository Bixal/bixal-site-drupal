import * as Toggle from "../../_utils/toggle.js";

window.addEventListener("DOMContentLoaded", () => {
  const menuTrigger = document.querySelector("[data-menu-toggle]");
  const menuTarget = document.querySelector("[data-menu-target]");
  const menuLabel = menuTrigger.querySelector(".bix-toggle-icon__text");

  const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");
  const labelClosed = "Menu";
  const labelOpen = "Close";

  /**
   * Show menu and update label to "Close".
   */
  function openMenu() {
    menuLabel.textContent = labelOpen;
    Toggle.show(menuTrigger, menuTarget);
  }

  /**
   * Hide menu and revert text label to default state.
   */
  function closeMenu() {
    menuLabel.textContent = labelClosed;
    Toggle.hide(menuTrigger, menuTarget);
  }

  /**
   * Close dropdown if the focus moves away or user hits escape.
   *
   * @param {Event} event
   */
  function handleKeyboard(event) {
    const isActive = Toggle.checkActive(menuTarget);

    if (!isActive) {
      return;
    }

    if (
      !menuTarget.contains(document.activeElement) ||
      (event.key === "Escape" && isActive)
    ) {
      closeMenu();
    }
  }

  /**
   * On click it will determine state and toggle based off of that.
   *
   * @param {Event} event
   */
  function handleClick(event) {
    const isActive = Toggle.checkActive(event.currentTarget);

    if (!isActive) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  /**
   * Reset menu based on screen size.
   *
   * @param {MediaQueryList} breakpoint
   */
  function handleResize(breakpoint) {
    if (breakpoint.matches) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  /**
   * Add event listeners.
   */
  function init() {
    // @TODO: Add a focus trap for A11Y.
    handleResize(desktopBreakpoint);
    menuTrigger.addEventListener("click", handleClick);
    desktopBreakpoint.addEventListener("change", handleResize);
    document.addEventListener("keyup", handleKeyboard);
  }

  init();
});
