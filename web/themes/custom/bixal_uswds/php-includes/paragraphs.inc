<?php

/**
 * @file
 * Bixal USWDS Paragraphs file.
 */

use Drupal\Core\Entity\FieldableEntityInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

/**
 * Implements hook_preprocess_paragraph().
 */
function bixal_uswds_preprocess_paragraph(&$vars) {
  // Define the $paragraph.
  $paragraph = $vars['elements']['#paragraph'];
  // Check for a $paragraph bundle.
  if (!empty($paragraph->bundle())) {
    // Define the bundle.
    $bundle = $paragraph->bundle();

    // If bundle type =.
    switch ($bundle) {
      case "bx_process_list_item":
        // Get the parent (host) $paragraph value and pass it down to the child.
        $host_value_title = $paragraph->getParentEntity()->field_bx_large_title->value;
        // If the value is checked.
        if ($host_value_title === '1') {
          // Set a template var.
          $vars['is_large_text'] = TRUE;
        }
        break;

      case "bx_card_item":
        // Get the parent (host) $paragraph values and pass down to the child.
        // These are all USWDS card variant settings.
        $host_value_title_pos_top = $paragraph->getParentEntity()->field_bx_card_title_pos->value;
        $host_value_flag = $paragraph->getParentEntity()->field_bx_flag->value;
        $host_value_flag_right = $paragraph->getParentEntity()->field_bx_flag_right->value;
        $host_value_media_inset = $paragraph->getParentEntity()->field_bx_media_inset->value;
        // Count the number of card items.
        $vars['card_count'] = count($paragraph->getParentEntity()->field_bx_card_item);
        // Check the booleans below.
        if ($host_value_title_pos_top === '1') {
          // Set a template var.
          $vars['is_title_position_top'] = TRUE;
        }

        if ($host_value_flag === '1') {
          // Set a template var.
          $vars['is_flag'] = TRUE;
        }

        if ($host_value_flag_right === '1') {
          // Set a template var.
          $vars['is_flag_right'] = TRUE;
        }

        if ($host_value_media_inset === '1') {
          // Set a template var.
          $vars['is_media_inset'] = TRUE;
        }
        break;

      case "people_list":
        // Load nodes of type bixaler.
        $entity_query = \Drupal::entityQuery('node');
        $entity_query->condition('type', 'bixaler')
          ->accessCheck(TRUE)
          ->sort('title', 'ASC');
        $results = $entity_query->execute();
        $nodes = Node::loadMultiple($results);
        if (empty($nodes)) {
          return;
        }

        // Setting up cache contexts.
        $cache_contexts = ['node'];
        $cache_contexts[] = '<bixaler>';

        // Instantiate arrays to pass to template.
        $filter_content = [];
        // Add 'All' option by default.
        $filter_options = ['All'];

        $field_ne_and_exists = static function (FieldableEntityInterface $entity, string $field_name) {
          return $entity->hasField($field_name) && !$entity->get($field_name)->isEmpty();
        };

        $get_media_image_url = static function (NodeInterface $node, $field_name) use (&$field_ne_and_exists) {
          // Get the media file field.
          if (!$field_ne_and_exists($node, $field_name)) {
            return '';
          }
          $media_entity = $node->get($field_name)->entity;
          // Get the file field on the media entity.
          if (!$field_ne_and_exists($media_entity, 'field_media_image')) {
            return '';
          }
          $file_entity = $media_entity->get('field_media_image')->entity;
          // Get the URL of the media file.
          $uri = $file_entity->getFileUri();
          return \Drupal::service('file_url_generator')->generateAbsoluteString($uri);
        };

        $get_first_term_ref_title = static function (NodeInterface $node, $field_name) use (&$field_ne_and_exists) {
          if (!$field_ne_and_exists($node, $field_name)) {
            return '';
          }
          $term_id = $node->get($field_name)->first()->getString();
          $term = Term::load($term_id);
          if ($term === NULL) {
            return '';
          }
          return $term->getName();
        };

        // Process each node to set values of each array item.
        foreach ($nodes as $node) {
          $team_name = $get_first_term_ref_title($node, 'field_team');

          // Set value of node.
          $filter_content[] = [
            'name' => $node->getTitle(),
            'image' => $get_media_image_url($node, 'field_image'),
            'role' => $get_first_term_ref_title($node, 'field_role'),
            'url' => $node->toUrl()->toString(),
            'filter_category' => strtolower($team_name),
          ];

          // Add team to array if it doesn't exist in array.
          if (strlen($team_name) && !in_array($team_name, $filter_options)) {
            $filter_options[] = $team_name;
          }
        }

        // Sort filter options.
        sort($filter_options);

        // Send arrays to template.
        $vars['content'] = [
          'filter_content' => $filter_content,
          'filter_options' => $filter_options,
        ];

        // Reset cache.
        $vars['#attached']['drupalSettings']['cacheContexts'] = $cache_contexts;
        break;

      case "job_listing":
        // Create jobs array, teams array, and client object.
        $client = new Client();
        $jobs = [];
        $teams = [
          'Corporate Operations',
          'Data Analytics',
          'Human Centered Design',
          'International',
          'Learning',
          'Program Management',
          'Technology',
          'Other Teams',
        ];

        // Try to read from API.
        try {
          foreach ($teams as $team) {
            $response = $client->get("https://api.lever.co/v0/postings/bixal", ['query' => ['department' => $team]]);
            $result = json_decode($response->getBody(), TRUE);
            $listings[$team] = $result;

            // Sort listing based on most recent.
            usort($listings[$team], function ($job1, $job2) {
              return $job2['createdAt'] <=> $job1['createdAt'];
            });

            // Remove all but most recent.
            array_splice($listings[$team], 1);

            // If team index of listings array isn't empty, set for jobs array.
            if (!empty($listings[$team])) {
              $jobs[] = [
                'title' => $listings[$team][0]['text'],
                'href' => $listings[$team][0]['hostedUrl'],
                'prefix' => $listings[$team][0]['categories']['team'],
                'postfix' => $listings[$team][0]['categories']['location'],
              ];
            }
          }

          // Set content to jobs.
          $vars['content'] = [
            'jobs' => $jobs,
          ];
        }
        catch (RequestException $e) {
          \Drupal::logger('system')->alert('Jobs could not be fetched from lever.');
        }

        break;

      default:
    }
  }
}
