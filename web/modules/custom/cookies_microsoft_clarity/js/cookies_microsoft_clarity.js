/**
 * @file
 * Defines Javascript behaviors for the cookies module.
 *
 * Microsoft Clarity needs two things, not one:
 *
 * 1. The tag itself must not load before consent. The COOKiES knock out
 *    renders it as text/plain and it is re-inserted here.
 * 2. Clarity must be told what the visitor decided. Since 2025-10-31 Clarity
 *    enforces a consent signal for visitors from the EEA, UK and Switzerland;
 *    without one it falls back to a cookieless mode that issues a new id per
 *    page view, so sessions never stitch together. Inserting the tag alone is
 *    therefore not enough.
 *
 * @see https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
 */
(function (Drupal, drupalSettings) {
  'use strict';

  var SCRIPT_ID = 'cookies_microsoft_clarity';
  var SERVICE_ID = 'microsoft_clarity';

  // Whether the Clarity tag has executed, i.e. window.clarity() is callable.
  var ready = false;
  // The visitor's most recent decision, or null while still unknown.
  var decision = null;
  // Guards against binding the listener more than once per page.
  var listening = false;

  /**
   * Passes the current decision to Clarity, if both are available.
   */
  function passConsent() {
    if (!ready || decision === null || typeof window.clarity !== 'function') {
      return;
    }
    window.clarity('consentv2', {
      ad_Storage: decision.ad ? 'granted' : 'denied',
      analytics_Storage: decision.analytics ? 'granted' : 'denied'
    });

    // consentv2 alone only downgrades Clarity to its cookieless mode. On a
    // withdrawal, erase the cookies it has already set (_clck and _clsk).
    if (!decision.analytics) {
      window.clarity('consent', false);
    }
  }

  /**
   * Restores the knocked out Clarity tag to an executable script element.
   */
  function activate() {
    var script = document.getElementById(SCRIPT_ID);

    if (!script || script.nodeName !== 'SCRIPT') {
      // Already restored by an earlier consent event.
      return;
    }

    var newScript = document.createElement('script');

    Array.prototype.forEach.call(script.attributes, function (attribute) {
      if (attribute.nodeName !== 'type' && attribute.nodeName !== 'id') {
        newScript.setAttribute(attribute.nodeName, attribute.nodeValue);
      }
    });
    newScript.innerHTML = script.innerHTML;

    // An external script executes asynchronously, so window.clarity() only
    // exists once it has loaded. Inline scripts fire no load event and have
    // already run by the time replaceChild() returns.
    if (newScript.src) {
      newScript.addEventListener('load', function () {
        ready = true;
        passConsent();
      });
      script.parentNode.replaceChild(newScript, script);
    }
    else {
      script.parentNode.replaceChild(newScript, script);
      ready = true;
    }
  }

  /**
   * Define defaults.
   */
  Drupal.behaviors.cookiesMicrosoftClarity = {

    attach: function () {
      if (listening) {
        return;
      }
      listening = true;

      document.addEventListener('cookiesjsrUserConsent', function (event) {
        var services = (typeof event.detail.services === 'object') ? event.detail.services : {};
        var adService = (drupalSettings.cookiesMicrosoftClarity || {}).adStorageService;

        decision = {
          analytics: !!services[SERVICE_ID],
          ad: adService ? !!services[adService] : false
        };

        if (decision.analytics) {
          activate();
        }

        // On a withdrawal the tag cannot be unloaded, but signalling "denied"
        // drops Clarity back to its cookieless mode for the rest of the visit.
        passConsent();
      });
    }
  };
})(Drupal, drupalSettings);
