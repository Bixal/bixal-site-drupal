<?php

namespace Drupal\bixal_drush_commands\Commands;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drush\Commands\DrushCommands;

/**
 * Drush command file for Bixal.
 */
class CustomCommands extends DrushCommands
{

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;


  /**
   * MyModuleCommands constructor.
   */
  public function __construct(ConfigFactoryInterface $configFactory)
  {
    $this->configFactory = $configFactory;
  }

  /**
   * A custom Drush command to set the homepage URL post site install.
   *
   * @command drush-command:set-homepage
   *
   * @aliases set-hp
   */
  public function setHomepage()
  {
    $nodes = \Drupal::entityTypeManager()->getStorage('node')->loadMultiple();
    $homepage_uuid = 'ed430371-da05-4a2b-a686-80fe68d22d7c';

    foreach ($nodes as $node) {
      if ($node->uuid() == $homepage_uuid) {
        $node_loaded_by_uuid = \Drupal::entityTypeManager()->getStorage('node')->loadByProperties(['uuid' => $homepage_uuid]);
        $entity = reset($node_loaded_by_uuid);
        $homepage_url = ('/node/' . $entity->id());
        $this->configFactory->getEditable('system.site')
          ->set('page.front', $homepage_url)
          ->save();

        $homepage_set = true;
      }
    }

    if ($homepage_set == true) {
      $this->io()->success(dt('Homepage has been set to' . $homepage_url));
    } else {
      $this->io()->warning(dt('Homepage could not be set'));
    }
  }
}
