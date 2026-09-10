/**
 * @file
 * Loads the Microsoft Clarity tag.
 *
 * When the cookies_microsoft_clarity module is enabled this file is knocked
 * out to text/plain until the visitor consents, and re-inserted by
 * js/cookies_microsoft_clarity.js.
 */
(function (drupalSettings) {
  "use strict";

  var settings = drupalSettings.microsoft_clarity || {};

  if (!settings.projectId) {
    return;
  }

  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", settings.projectId);

  // The snippet above defines clarity() as a queue, so tags set here are
  // replayed once the remote tag has loaded.
  var tags = settings.tags || {};
  Object.keys(tags).forEach(function (name) {
    window.clarity("set", name, tags[name]);
  });
})(drupalSettings);
