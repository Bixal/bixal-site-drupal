
/**
 * Utility that toggles visibility and active class.
 */

export const activeClass = "is-active";


/**
 * Check if element has active class.
 *
 * @param {HTMLElement} element - Element to check class.
 * @returns {Boolean}
 */
function checkActive(element) {
  return element.classList.contains(activeClass);
}

/**
 * Show the hidden element.
 *
 * @param {HTMLElement} trigger - A button for the element.
 * @param {HTMLElement} target - An element which visibility is shown.
 */
function show(trigger, target) {
  trigger.classList.add(activeClass);
  target.classList.add(activeClass);
  target.removeAttribute("hidden");
}

/**
 * Hide the hidden element.
 *
 * @param {HTMLElement} trigger - A button for the element.
 * @param {HTMLElement} target - An element which visibility is shown.
 */
function hide(trigger, target) {
  trigger.classList.remove(activeClass);
  target.classList.remove(activeClass);
  target.setAttribute("hidden", "");
}

/**
 * Toggle active state and visibility.
 *
 * @param {Event} event - Checks currentTarget to determine trigger, target, and state.
 *
 * @example
 *  buttonElement.addEventListener("click", Toggle.toggle);
 *
 */
function toggle(event) {
  const trigger = event.currentTarget;
  const target = document.getElementById(trigger.getAttribute("aria-controls"))

  const isActive = checkActive(trigger);

  if (!isActive) {
    show(trigger, target);
  } else {
    hide(trigger, target);
  }
}

export {

  checkActive,
  show,
  hide,
  toggle,
};
