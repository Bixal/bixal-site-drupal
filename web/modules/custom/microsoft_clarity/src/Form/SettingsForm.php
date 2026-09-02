<?php

declare(strict_types=1);

namespace Drupal\microsoft_clarity\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configures which Microsoft Clarity project the site reports to.
 */
final class SettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'microsoft_clarity_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames(): array {
    return ['microsoft_clarity.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {
    $form['project_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Project ID'),
      '#default_value' => $this->config('microsoft_clarity.settings')->get('project_id'),
      '#size' => 32,
      '#maxlength' => 32,
      '#description' => $this->t('Found in Clarity under Settings &rarr; Setup, and in the tracking snippet as the last argument. Leave empty to stop embedding the tag.'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state): void {
    $project_id = trim((string) $form_state->getValue('project_id'));

    if ($project_id !== '' && preg_match('/^[a-z0-9]+$/', $project_id) !== 1) {
      $form_state->setErrorByName('project_id', $this->t('The project ID may only contain lowercase letters and numbers.'));
    }

    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $this->config('microsoft_clarity.settings')
      ->set('project_id', trim((string) $form_state->getValue('project_id')))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
