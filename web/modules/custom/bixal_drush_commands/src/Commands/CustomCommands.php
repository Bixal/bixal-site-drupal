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
  public function setHomepage() {
    $nodes = $this->entityTypeManager->getStorage('node')->loadMultiple();
    $homepage_uuid = 'ed430371-da05-4a2b-a686-80fe68d22d7c';

    foreach ($nodes as $node) {
      if ($node->uuid() == $homepage_uuid) {
        $node_loaded_by_uuid = $this->entityTypeManager->getStorage('node')->loadByProperties(['uuid' => $homepage_uuid]);
        $entity = reset($node_loaded_by_uuid);
        $homepage_url = ('/node/' . $entity->id());
        $this->configFactory->getEditable('system.site')
          ->set('page.front', $homepage_url)
          ->save();

        $homepage_set = TRUE;
      }
    }

    if ($homepage_set == TRUE) {
      $this->io()->success(dt('Homepage has been set to' . $homepage_url));
    }
    else {
      $this->io()->warning(dt('Homepage could not be set'));
    }
  }

}
