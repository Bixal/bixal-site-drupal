window.addEventListener("DOMContentLoaded", () => {
  const menuTrigger = document.querySelector("[data-menu-toggle]");
  const menuTarget = document.querySelector("[data-menu-target]");
  const menuLabel = menuTrigger.querySelector(".bix-toggle-icon__text");

  const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");
  const activeClass = "is-active";
  const labelClosed = "Menu";
  const labelOpen = "Close";

  function showMenu() {
    menuLabel.textContent = labelOpen;
    menuTrigger.classList.add(activeClass);
    menuTarget.classList.add(activeClass);
    menuTarget.removeAttribute("hidden");
  }

  function hideMenu() {
    menuLabel.textContent = labelClosed;
    menuTrigger.classList.remove(activeClass);
    menuTarget.classList.remove(activeClass);
    menuTarget.setAttribute("hidden", "");
  }

  function toggleMenu(e) {
    const isActive = menuTarget.classList.contains(activeClass);

    if (!isActive) {
      showMenu();
    } else {
      hideMenu();
    }
  }

  function handleEscape(e) {
    if (e.key === "Escape" && menuTarget.classList.contains(activeClass)) {
      hideMenu();
    }
  }

  function handleResize(breakpoint) {
    if (breakpoint.matches) {
      showMenu();
    } else {
      hideMenu();
    }
  }

  function init() {
    handleResize(desktopBreakpoint);
    menuTrigger.addEventListener("click", toggleMenu);
    desktopBreakpoint.addEventListener("change", handleResize);
    document.addEventListener("keyup", handleEscape);
  }

  init();
});
