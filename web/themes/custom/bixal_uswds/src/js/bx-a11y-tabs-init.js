/**
 * a11y Tabs JS functions.
 * @file
 */
// Always use "use strict";
("use strict");

(function (Drupal) {
  Drupal.behaviors.uswdsA11YTabsInit = {
    attach: function () {
      // Initialize a11y tabs.
      window.addEventListener("DOMContentLoaded", () => {
        new A11yTabs(".c-tabs__list", '[role="tabpanel"]', 0);
      });
    },
  };
})(Drupal);
