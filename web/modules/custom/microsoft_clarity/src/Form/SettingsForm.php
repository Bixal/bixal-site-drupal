<?php

declare(strict_types=1);

namespace Drupal\microsoft_clarity\Form;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Configures how the site reports to Microsoft Clarity.
 */
final class SettingsForm extends ConfigFormBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): static {
    $instance = parent::create($container);
    $instance->entityTypeManager = $container->get('entity_type.manager');

    return $instance;
  }

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
    $config = $this->config('microsoft_clarity.settings');

    $form['project_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Project ID'),
      '#default_value' => $config->get('project_id'),
      '#size' => 32,
      '#maxlength' => 32,
      '#description' => $this->t('Found in Clarity under Settings &rarr; Setup, and in the tracking snippet as the last argument. Leave empty to stop embedding the tag.'),
    ];

    $form['visibility'] = [
      '#type' => 'details',
      '#title' => $this->t('Who and what gets recorded'),
      '#open' => TRUE,
      '#description' => $this->t('Administration pages are never recorded, because session replays there would capture unpublished content and other users&rsquo; data.'),
    ];

    $form['visibility']['excluded_roles'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Exclude these roles'),
      '#options' => array_map(
        static fn ($role) => $role->label(),
        $this->entityTypeManager->getStorage('user_role')->loadMultiple()
      ),
      '#default_value' => $config->get('excluded_roles') ?: [],
      '#description' => $this->t('Users holding any of these roles are not recorded anywhere on the site. Excluding staff roles keeps heatmaps and recordings representative of real visitors.'),
    ];

    $form['visibility']['excluded_paths'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Exclude these paths'),
      '#default_value' => $config->get('excluded_paths'),
      '#rows' => 5,
      '#description' => $this->t('One path per line, starting with a slash. Use * as a wildcard and @front for the front page, for example @example', [
        '@front' => '<front>',
        '@example' => '/user/*',
      ]),
    ];

    $form['custom_tags'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Send custom tags'),
      '#options' => _microsoft_clarity_available_tags(),
      '#default_value' => $config->get('custom_tags') ?: [],
      '#description' => $this->t('Custom tags become filters inside Clarity, so recordings and heatmaps can be segmented by your content model rather than by URL alone.'),
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

    foreach ($this->splitLines((string) $form_state->getValue('excluded_paths')) as $path) {
      if (!str_starts_with($path, '/') && $path !== '<front>') {
        $form_state->setErrorByName('excluded_paths', $this->t('Path %path must start with a slash, or be @front.', [
          '%path' => $path,
          '@front' => '<front>',
        ]));
        break;
      }
    }

    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $this->config('microsoft_clarity.settings')
      ->set('project_id', trim((string) $form_state->getValue('project_id')))
      ->set('excluded_roles', array_values(array_filter($form_state->getValue('excluded_roles'))))
      ->set('excluded_paths', implode("\n", $this->splitLines((string) $form_state->getValue('excluded_paths'))))
      ->set('custom_tags', array_values(array_filter($form_state->getValue('custom_tags'))))
      ->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * Splits a textarea value into trimmed, non-empty lines.
   *
   * @param string $value
   *   The raw textarea value.
   *
   * @return string[]
   *   The individual lines.
   */
  private function splitLines(string $value): array {
    return array_values(array_filter(array_map('trim', preg_split('/\R/', $value) ?: [])));
  }

}
