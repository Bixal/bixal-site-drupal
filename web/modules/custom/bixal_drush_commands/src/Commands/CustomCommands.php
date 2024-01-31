<?php

namespace Drupal\bixal_drush_commands\Commands;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManager;
use Drush\Commands\DrushCommands;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Drush command file for Bixal.
 */
class CustomCommands extends DrushCommands {

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManager
   */
  protected $entityTypeManager;

  /**
   * MyModuleCommands constructor.
   */
  public function __construct(ConfigFactoryInterface $configFactory, EntityTypeManager $entityTypeManager) {
    $this->configFactory = $configFactory;
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('entity_type.manager')
    );
  }

  /**
   * Retrieves the entity type manager.
   *
   * @return \Drupal\Core\Entity\EntityTypeManager
   *   The entity type manager.
   */
  public function getEntityTypeManager() {
    return $this->entityTypeManager;
  }

  /**
   * A custom Drush command to set the homepage URL post site install.
   *
   * @command drush-command:set-homepage
   *
   * @aliases set-hp
   */
  public function setHomepage(array $options = []) {
    $no_interaction = FALSE;
    if ($options['no-interaction'] || $options['yes']) {
      $no_interaction = TRUE;
    }
    $homepage_uuid_file = '../.homepage-uuid';
    $homepage_uuid = file_get_contents($homepage_uuid_file);
    if (!$homepage_uuid) {
      if ($no_interaction) {
        $this->io()->warning(dt('Your homepage has not been set yet, do so by calling drush set-hp'));
        return;
      }
      else {
        $homepage_uuid = $this->ask('What is the UUID of your homepage node?');
        if (!$homepage_uuid) {
          throw new \Exception(dt('A homepage is required'));
        }
        file_put_contents($homepage_uuid_file, $homepage_uuid);
      }
    }

    $nodes = $this->entityTypeManager->getStorage('node')->loadByProperties(['uuid' => $homepage_uuid]);
    if (empty($nodes)) {
      file_put_contents($homepage_uuid_file, '');
      throw new \Exception(dt('Unable to find a node for homepage by UUID ') . $homepage_uuid);
    }
    /** @var \Drupal\node\NodeInterface $node */
    $node = reset($nodes);
    $homepage_url = '/node/' . $node->id();
    $this->configFactory->getEditable('system.site')
      ->set('page.front', $homepage_url)
      ->save();
    $this->io()->success(dt('Homepage has been set to ') . $homepage_url);
  }

}
