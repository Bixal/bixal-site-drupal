<?php

declare(strict_types=1);

namespace Drupal\microsoft_clarity\Hook;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Path\CurrentPathStack;
use Drupal\Core\Path\PathMatcherInterface;
use Drupal\Core\Routing\AdminContext;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\path_alias\AliasManagerInterface;

/**
 * Hook implementations for microsoft_clarity.
 */
class MicrosoftClarityHooks {

  public function __construct(
    protected readonly AdminContext $adminContext,
    protected readonly ConfigFactoryInterface $configFactory,
    protected readonly AccountInterface $currentUser,
    protected readonly RouteMatchInterface $routeMatch,
    protected readonly LanguageManagerInterface $languageManager,
    protected readonly PathMatcherInterface $pathMatcher,
    protected readonly CurrentPathStack $currentPath,
    protected readonly AliasManagerInterface $aliasManager,
  ) {}

  /**
   * Implements hook_page_attachments().
   */
  #[Hook('page_attachments')]
  public function pageAttachments(array &$attachments): void {
    // Keep Clarity off the administrative UI. It records full session
    // replays, so on admin routes it would capture unpublished content,
    // other users' data and whatever is typed into admin forms. No cache
    // metadata is needed for this check: Dynamic Page Cache varies every item
    // by 'route' already.
    // @see \Drupal\dynamic_page_cache\EventSubscriber\DynamicPageCacheSubscriber::$cacheContexts
    if ($this->adminContext->isAdminRoute()) {
      return;
    }

    $config = $this->configFactory->get('microsoft_clarity.settings');

    $cacheable_metadata = CacheableMetadata::createFromRenderArray($attachments);
    $cacheable_metadata->addCacheableDependency($config);

    $project_id = trim((string) $config->get('project_id'));
    if ($project_id === '') {
      $cacheable_metadata->applyTo($attachments);
      return;
    }

    $excluded_roles = $config->get('excluded_roles') ?: [];
    if ($excluded_roles !== []) {
      $cacheable_metadata->addCacheContexts(['user.roles']);
      if (array_intersect($this->currentUser->getRoles(), $excluded_roles) !== []) {
        $cacheable_metadata->applyTo($attachments);
        return;
      }
    }

    $excluded_paths = trim((string) $config->get('excluded_paths'));
    if ($excluded_paths !== '') {
      $cacheable_metadata->addCacheContexts(['url.path']);
      if ($this->pathIsExcluded($excluded_paths)) {
        $cacheable_metadata->applyTo($attachments);
        return;
      }
    }

    $settings = ['projectId' => $project_id];

    $tags = $this->customTags($config->get('custom_tags') ?: [], $cacheable_metadata);
    if ($tags !== []) {
      $settings['tags'] = $tags;
    }

    $cacheable_metadata->applyTo($attachments);

    $attachments['#attached']['library'][] = 'microsoft_clarity/microsoft_clarity';
    $attachments['#attached']['drupalSettings']['microsoft_clarity'] = $settings;
  }

  /**
   * Checks the current path against a set of exclusion patterns.
   *
   * Both the alias and the internal path are tested, so a pattern matches
   * whichever form the editor happened to enter.
   *
   * @param string $patterns
   *   Newline separated path patterns, as entered on the settings form.
   *
   * @return bool
   *   TRUE if the current path is excluded from tracking.
   */
  private function pathIsExcluded(string $patterns): bool {
    $current_path = $this->currentPath->getPath();
    $path = $current_path === '/' ? $current_path : rtrim($current_path, '/');
    $alias = mb_strtolower($this->aliasManager->getAliasByPath($path));
    $patterns = mb_strtolower($patterns);

    return $this->pathMatcher->matchPath($alias, $patterns)
      || ($path !== $alias && $this->pathMatcher->matchPath($path, $patterns));
  }

  /**
   * Builds the custom tags handed to Clarity's set() API.
   *
   * @param array $enabled
   *   The tag names enabled on the settings form.
   * @param \Drupal\Core\Cache\CacheableMetadata $cacheable_metadata
   *   Collects the cache contexts the selected tags vary by.
   *
   * @return array
   *   Tag names mapped to their value for the current page.
   *
   * @see _microsoft_clarity_available_tags()
   */
  private function customTags(array $enabled, CacheableMetadata $cacheable_metadata): array {
    $tags = [];

    foreach ($enabled as $name) {
      switch ($name) {
        case 'content_type':
          // The node is a route parameter, so this varies per route.
          $cacheable_metadata->addCacheContexts(['route']);
          $node = $this->routeMatch->getParameter('node');
          if ($node instanceof EntityInterface) {
            $tags['content_type'] = $node->bundle();
          }
          break;

        case 'language':
          $cacheable_metadata->addCacheContexts(['languages:language_interface']);
          $tags['language'] = $this->languageManager->getCurrentLanguage()->getId();
          break;

        case 'route':
          $cacheable_metadata->addCacheContexts(['route.name']);
          $route_name = $this->routeMatch->getRouteName();
          if ($route_name !== NULL) {
            $tags['route'] = $route_name;
          }
          break;
      }
    }

    return $tags;
  }

}
