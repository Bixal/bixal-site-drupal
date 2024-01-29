<?php

namespace Drupal\block_node\Plugin\Block;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Entity\EntityDisplayRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'NodeBlock' block.
 *
 * @Block(
 *   id = "node_block",
 *   admin_label = @Translation("Node block"),
 *   category = @Translation("Content")
 * )
 */
class NodeBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The entity view builder interface.
   *
   * @var \Drupal\Core\Entity\EntityViewBuilderInterface
   */
  private $viewBuilder;

  /**
   * The node interface.
   *
   * @var \Drupal\node\NodeInterface
   */
  private $node;

  /**
   * The node storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $nodeStorage;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityDisplayRepositoryInterface
   */
  protected $entityDisplayRepository;

  /**
   * The route match.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * Constructs a NodeBlock instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the formatter.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Entity\EntityDisplayRepositoryInterface $entity_display_repository
   *   The entity display repository.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_manager
   *   The entity type manager.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The route match.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityDisplayRepositoryInterface $entity_display_repository, EntityTypeManagerInterface $entity_manager, RouteMatchInterface $route_match) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->nodeStorage = $entity_manager->getStorage('node');
    $this->viewBuilder = $entity_manager->getViewBuilder('node');
    $this->routeMatch = $route_match;
    // If the current node should be used attempt to load it.
    if (empty($configuration['current'])) {
      $this->node = isset($configuration['nid']) ? $this->nodeStorage->load($configuration['nid']) : [];
    }
    else {
      $this->node = $this->routeMatch->getParameter('node');
    }
    $this->entityDisplayRepository = $entity_display_repository;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_display.repository'),
      $container->get('entity_type.manager'),
      $container->get('current_route_match')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {

    $form = parent::blockForm($form, $form_state);

    // Retrieve existing configuration for this block.
    $config = $this->getConfiguration();

    $form['current'] = [
      '#title' => $this->t('Use current node?'),
      '#description' => $this->t('Will display the currently displayed node in the
      specified view mode. Useful for showing certain fields from the current
      node in a block. Uncheck to pick a specific node.'),
      '#type' => 'checkbox',
      '#default_value' => $config['current'] ?? 1,
    ];

    // Add a form field to the existing block configuration form.
    $form['nid'] = [
      '#title' => $this->t('Node to display'),
      '#description' => $this->t('The node you want to display'),
      '#type' => 'entity_autocomplete',
      '#target_type' => 'node',
      '#selection_handler' => 'default',
      '#default_value' => !empty($config['nid']) ? $this->nodeStorage->load($config['nid']) : NULL,
      '#states' => [
        'invisible' => [
          ':input[name="settings[current]"]' => [
            'checked' => TRUE,
          ],
        ],
      ],
    ];

    // View modes.
    $options = [];
    $view_modes = $this->entityDisplayRepository->getAllViewModes();
    if (isset($view_modes['node'])) {
      foreach ($view_modes['node'] as $view_mode => $view_mode_info) {
        $options[$view_mode] = $view_mode_info['label'];
      }
    }

    $form['view_mode'] = [
      '#title' => $this->t('View mode'),
      '#description' => $this->t('Select the view mode you want your node to render in. This will only work for view modes that are marked as having a "custom" display mode for the content type. For example, "Full" will not work if your content type does not have "Full" marked as custom, instead choose "Default" which usually calls "Full".'),
      '#type' => 'select',
      '#options' => $options,
      '#default_value' => $config['view_mode'] ?? 'full',
      '#required' => TRUE,
    ];

    $form['enabled_view_mode_only'] = [
      '#title' => $this->t('Use enabled view mode only?'),
      '#description' => $this->t('Will only show the block if the display mode is enabled in "Use custom display settings for the following view modes" for each content type. This is handy if you have different enabled view modes between content types. This way, you don\'t need to use block visibility rules, it will only show on nodes that support the view mode. Don\'t use this option if you want to use "Full" unless "Full" is checked as a custom display setting in your content types.'),
      '#type' => 'checkbox',
      '#default_value' => $config['enabled_view_mode_only'] ?? 0,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    // Save our custom settings when the form is submitted.
    $this->setConfigurationValue('current', $form_state->getValue('current'));
    $this->setConfigurationValue('nid', $form_state->getValue('nid'));
    $this->setConfigurationValue('view_mode', $form_state->getValue('view_mode'));
    $this->setConfigurationValue('enabled_view_mode_only', $form_state->getValue('enabled_view_mode_only'));
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $config = $this->getConfiguration();
    if (!$this->node instanceof NodeInterface) {
      return $build;
    }
    $view_mode = $config['view_mode'] ?? 'full';
    if ($config['enabled_view_mode_only'] ?? 0) {
      $view_modes_for_ct = $this->entityDisplayRepository
        ->getViewModeOptionsByBundle('node', $this->node->bundle());
      if (!array_key_exists($view_mode, $view_modes_for_ct)) {
        return $build;
      }
    }
    return $this->viewBuilder->view($this->node, $view_mode);
  }

  /**
   * {@inheritdoc}
   */
  public function blockAccess(AccountInterface $account, $return_as_object = FALSE) {
    if (empty($this->node)) {
      return AccessResult::allowed();
    }
    return $this->node->access('view', NULL, TRUE);
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheTags() {
    if ($node = $this->routeMatch->getParameter('node')) {
      return Cache::mergeTags(parent::getCacheTags(), ['node:' . $node->id()]);
    }
    else {
      return parent::getCacheTags();
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheContexts() {
    // This module often depends on the route to know which node to load, so
    // route should be part of the cache context.
    return Cache::mergeContexts(parent::getCacheContexts(), ['route']);
  }

}
