<?php

/**
 * @file
 * Bixal USWDS Paragraphs file.
 */

use Drupal\Core\Entity\FieldableEntityInterface;
use Drupal\image\Entity\ImageStyle;
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
  /** @var \Drupal\paragraphs\Entity\Paragraph $paragraph */
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
        $results = $entity_query->condition('type', 'bixaler')
          ->accessCheck(TRUE)
          ->condition('status', NodeInterface::PUBLISHED)
          ->sort('title', 'ASC')
          ->execute();
        $nodes = Node::loadMultiple($results);
        if (empty($nodes)) {
          return;
        }

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
          $url = ImageStyle::load('bixaler_thumbnail')->buildUrl($uri);
          return $url;
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

        $get_multiple_term_ref_title = static function (NodeInterface $node, $field_name) use (&$field_ne_and_exists): array {
          if (!$field_ne_and_exists($node, $field_name)) {
            return [];
          }
          if (empty($term_ids = explode(', ', $node->get($field_name)->getString()))) {
            return [];
          }
          $return = [];
          foreach (Term::loadMultiple($term_ids) as $term) {
            if ($term === NULL || !$term->isPublished()) {
              continue;
            }
            $return[] = $term->getName();
          }
          return $return;
        };

        // Process each node to set values of each array item.
        foreach ($nodes as $node) {
          $current_team_names = $get_multiple_term_ref_title($node, 'field_team');

          // Set value of node.
          $filter_content[] = [
            'name' => $node->getTitle(),
            'image' => $get_media_image_url($node, 'field_image'),
            'role' => $get_first_term_ref_title($node, 'field_role'),
            'url' => $node->toUrl()->toString(),
            'filter_category' => implode('|||', array_map('strtolower', $current_team_names)),
          ];

          // Add team to array if it doesn't exist in array.
          $new_team_names = array_diff($current_team_names, $filter_options);
          if (!empty($new_team_names)) {
            $filter_options = array_merge($filter_options, $new_team_names);
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
        $vars['#cache']['tags'][] = "node_list:bixaler";

        break;

      case 'images':
        /** @var \Drupal\file\Plugin\Field\FieldType\FileFieldItemList $image_field */
        $image_field = $paragraph->get('field_image_upload');
        if ($image_field->isEmpty()) {
          break;
        }
        // Create a render array of the image and add the URL or width from the
        // the other fields.
        $image_field_render_array = $image_field->view();
        $width_field = $paragraph->get('field_width');
        if (!$width_field->isEmpty()) {
          $width = $width_field->getString();
          $image_field_value = $image_field->first()->getValue();
          // If a height and width is set, update the height so it's the same
          // scale as the new width.
          if (!empty($image_field_value['height']) && !empty($image_field_value['width'])) {
            $image_field_render_array[0]['#item_attributes']['height'] = floor($image_field_value['height'] * ($width / $image_field_value['width']));
          }
          $image_field_render_array[0]['#item_attributes']['width'] = $width;
        }
        $url_field = $paragraph->get('field_url');
        if (!$url_field->isEmpty()) {
          $image_field_render_array[0]['#url'] = $url_field->getString();
        }
        $vars['image'] = $image_field_render_array;
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
