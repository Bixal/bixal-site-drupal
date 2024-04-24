<?php

/**
 * @file
 * Alterations for front-end forms.
 */

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element;

/**
 * Implements hook_form_alter().
 */
function bixal_uswds_form_alter(&$form, FormStateInterface $form_state, $form_id): void {
  // Alter specific forms on the front-end.
  // The search form block in the header.
  if ($form_id === 'search_block_form') {
    $form["actions"]["submit"]['#attributes']['data-twig-suggestion'] = 'search_block_submit';
    $form["keys"]['#attributes']['placeholder'] = t('Search...');
  }

  // Search results page form.
  if ($form_id === 'search_form') {
    // Add theme suggestions for the search form
    // search button the search results page.
    // We need to account for basic and advanced search.
    // Theme hook setups for theme_suggestions_input_alter.
    $form['basic']['submit']['#attributes']['data-twig-suggestion'] = 'search_form_page';
    // Add the USWDS class here.
    $form['#attributes']['class'][] = 'usa-search usa-search--big';
    // Adjust the prefix for the advanced search.
    $form["advanced"]["submit"]["#prefix"] = '<div class="action margin-top-2">';
    // Open the details wrapper by default.
    $form["advanced"]["#open"] = TRUE;
    // Add a placeholder.
    $form["basic"]["keys"]['#attributes']['placeholder'] = t('Enter search terms');
  }
  elseif ($form_id === 'contact_message_site_wide_form') {
    foreach (Element::children($form) as $key) {
      $field =& $form[$key]['widget'][0]['value'];
      switch ($key) {
        case 'field_company':
        case 'message':
          $field['#title_display'] = 'form-no-label';
          $field['#no_wrapper'] = 1;
          if ($key === 'message') {
            $field['#placeholder'] = t('Want to find out more or interested in doing business with us? type message here...');
          }
          else {
            $field['#placeholder'] = $field['#title'];
          }
          if (!empty($field['#required'])) {
            $field['#placeholder'] .= ' *';
          }
          break;

        case 'name':
        case 'mail':
          $form[$key] = [
            '#type' => 'textfield',
            '#title' => $form[$key]['#title'],
            '#title_display' => 'form-no-label',
            '#maxlength' => 255,
            '#required' => TRUE,
            '#default_value' => $form[$key]['#value'] ?? '',
            '#placeholder' => $form[$key]['#title'],
            '#no_wrapper' => 1,
            '#disabled' => !empty($form[$key]['#value']),
          ];
          if ($key === 'mail') {
            $form[$key]['#placeholder'] = t('Email');
          }
          if (!empty($form[$key]['#required'])) {
            $form[$key]['#placeholder'] .= ' *';
          }
          break;

        case 'subject':
          $field['#type'] = 'hidden';
          $field['#value'] = 'Submission';
          $field['#no_wrapper'] = 1;
          break;

        case 'footer':
          $form[$key]['#access'] = FALSE;
          break;

        case 'actions':
          $form[$key]['#attributes']['class'][] = 'bix-contact__actions';
          $form[$key]['submit']['#attributes']['class'] = ['bix-button', 'bix-button--inverse'];
          $form[$key]['submit']['#value'] = t('Submit');
          break;

      }
    }
    unset($field);

    $form['#attributes']['class'][] = 'bix-contact__form';
  }

  // Add the USWDS form class.
  $form['#attributes']['class'][] = 'usa-form';
}

/**
 * Implements hook_theme_suggestions_HOOK_alter() for form templates.
 */
function bixal_uswds_theme_suggestions_form_alter(array &$suggestions, array $vars): void {
  // General theme suggestion with form id.
  $suggestions[] = $vars['theme_hook_original'] . '__' . $vars['element']['#form_id'];
}

/**
 * Implements hook_preprocess_form_element().
 */
function bixal_uswds_preprocess_form_element(&$vars): void {
  // If the form element is disabled, add a class.
  if ($vars['disabled']) {
    $vars['label']['#attributes']['class'][] = 'is-disabled';
  }

  if (!empty($vars['element']['#no_wrapper'])) {
    $vars['no_wrapper'] = 1;
  }
}

/**
 * Implements hook_preprocess_input().
 */
function bixal_uswds_preprocess_input(&$vars): void {
  if ($vars['element']['#type'] !== 'submit') {
    $vars['attributes']['class'][] = 'bix-input';
  }
}

/**
 * Implements hook_preprocess_input().
 */
function bixal_uswds_preprocess_textarea(&$vars): void {
  $vars['attributes']['class'][] = 'bix-input';
  $vars['attributes']['class'][] = 'bix-input--textarea';
}

/**
 * Implements hook_preprocess_form_element_label().
 */
function bixal_uswds_preprocess_form_element_label(&$vars): void {
  // Define the label for element.
  if (!empty($vars["element"]["#form_element_type"])) {
    $type = $vars["element"]["#form_element_type"];
    $vars['attributes']['class'][] = 'form-item__label usa-' . $type . '__label';
  }
}

/**
 * Implements hook_preprocess_input__search().
 */
function bixal_uswds_preprocess_input__search(&$vars): void {
  $vars['attributes']['class'][] = 'usa-input';
}

/**
 * Implements hook_theme_suggestions_input_alter().
 */
function bixal_uswds_theme_suggestions_input_alter(&$suggestions, array $vars): void {
  // Define the element.
  $element = $vars['element'];
  // Search form block theme hook.
  if ((isset($element['#attributes']['data-twig-suggestion']) && ($element['#attributes']['data-twig-suggestion'] === 'search_block_submit'))) {
    // Custom search button theme suggestion.
    $suggestions[] = $vars['theme_hook_original'] . '__search_block_submit';
  }

  if ((isset($element['#attributes']['data-twig-suggestion']) && ($element['#attributes']['data-twig-suggestion'] === 'search_form_page'))) {
    // Custom search button theme suggestion.
    $suggestions[] = $vars['theme_hook_original'] . '__search_form_page';
  }
}

/**
 * Implements template_uswds_preprocess_datetime_form().
 */
function bixal_uswds_preprocess_datetime_form(&$vars) {
  // Make placeholders an empty string to conform to USWDS.
  $vars["content"]["date"]["#attributes"]["placeholder"] = '';
  $vars["content"]["time"]["#attributes"]["placeholder"] = '';
}

/**
 * Implements template_uswds_preprocess_input__date().
 */
function bixal_uswds_preprocess_input__date(&$vars) {
  // Get the theme settings time picker style.
  if ($vars["element"]["#attributes"]["type"] === 'time') {
    $time_picker_style_setting = theme_get_setting('time_picker_style');
    $vars['time_picker_style'] = $time_picker_style_setting;
  }
}

/**
 * Implements template_uswds_preprocess_item_list__search_results().
 */
function bixal_uswds_preprocess_item_list__search_results(&$vars) {
  // Adjust this tag to an h2 tag for a11y.
  $vars["empty"]["#markup"] = '<h2>' . t('Your search yielded no results') . '</h2>';
}
