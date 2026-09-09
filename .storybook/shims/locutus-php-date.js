/**
 * Re-exports locutus' `date()` as a default export.
 *
 * `drupal-twig-extensions` does `import date from 'locutus/php/datetime/date.js'`,
 * which locutus 3.x breaks in two ways: its `exports` map (`"./*" -> "./*.js"`)
 * rejects a specifier that already ends in `.js`, and its ESM build exposes
 * only a named `date` export where 2.x also had a default. Both are resolved
 * here rather than by pinning locutus back to the vulnerable 2.x line.
 *
 * @see .storybook/main.js for the alias that points at this file.
 */
export { date as default } from "locutus/php/datetime/date";
