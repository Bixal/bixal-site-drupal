<?php

declare(strict_types=1);

namespace Drupal\cookies_microsoft_clarity\Hook;

use Drupal\Core\Asset\AttachedAssetsInterface;
use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleExtensionList;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Hook\Attribute\Hook;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\cookies\Constants\CookiesConstants;
use Drupal\cookies\CookiesKnockOutService;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Hook implementations for cookies_microsoft_clarity.
 */
class CookiesMicrosoftClarityHooks {

  use StringTranslationTrait;

  public function __construct(
    #[Autowire(service: 'cookies.knock_out')]
    protected readonly CookiesKnockOutService $knockOut,
    protected readonly ConfigFactoryInterface $configFactory,
    protected readonly EntityTypeManagerInterface $entityTypeManager,
    protected readonly ModuleExtensionList $moduleExtensionList,
  ) {}

  /**
   * Implements hook_help().
   */
  #[Hook('help')]
  public function help($route_name, RouteMatchInterface $route_match): ?string {
    if ($route_name === 'help.page.cookies_microsoft_clarity') {
      $output = '';
      $output .= '<h3>' . $this->t('About') . '</h3>';
      $output .= '<p>' . $this->t('Submodule of COOKiES to manage Microsoft Clarity (by "microsoft_clarity" module) inside of COOKiES consent management.') . '</p>';
      $output .= '<p>' . $this->t('The Clarity tag is withheld until the visitor consents. On consent it is inserted and the decision is additionally passed to Microsoft through the Clarity Consent API v2, which Clarity requires for visitors from the EEA, UK and Switzerland.') . '</p>';

      return $output;
    }

    return NULL;
  }

  /**
   * Implements hook_page_attachments().
   */
  #[Hook('page_attachments')]
  public function pageAttachments(array &$attachments): void {
    if (!$this->knockOut->doKnockOut()) {
      return;
    }

    $config = $this->configFactory->get('cookies_microsoft_clarity.settings');

    $cacheable_metadata = CacheableMetadata::createFromRenderArray($attachments);
    $cacheable_metadata->addCacheableDependency($config);
    $cacheable_metadata->applyTo($attachments);

    $attachments['#attached']['library'][] = 'cookies_microsoft_clarity/microsoft_clarity';
    $attachments['#attached']['drupalSettings']['cookiesMicrosoftClarity'] = [
      'adStorageService' => $config->get('ad_storage_service') ?: NULL,
    ];
  }

  /**
   * Implements hook_js_alter().
   */
  #[Hook('js_alter')]
  public function jsAlter(&$javascript, AttachedAssetsInterface $assets, LanguageInterface $language): void {
    if (!$this->knockOut->doKnockOut()) {
      return;
    }

    $script = $this->moduleExtensionList->getPath('microsoft_clarity') . '/js/microsoft_clarity.js';

    if (!isset($javascript[$script])) {
      return;
    }

    $javascript[$script]['preprocess'] = FALSE;
    $javascript[$script]['attributes']['type'] = CookiesConstants::COOKIES_SCRIPT_KO_TYPE;
    $javascript[$script]['attributes']['id'] = 'cookies_microsoft_clarity';
    $javascript[$script]['attributes']['data-cookieconsent'] = 'microsoft_clarity';
  }

  /**
   * Implements hook_form_FORM_ID_alter() for microsoft_clarity_settings.
   *
   * The consent options live here rather than in the microsoft_clarity module
   * so that they only exist while this submodule is enabled, and so that
   * microsoft_clarity stays unaware of COOKiES.
   */
  #[Hook('form_microsoft_clarity_settings_alter')]
  public function formMicrosoftClaritySettingsAlter(array &$form, FormStateInterface $form_state): void {
    $options = [];
    foreach ($this->entityTypeManager->getStorage('cookies_service')->loadMultiple() as $id => $service) {
      $options[$id] = $this->t('@label (@group)', [
        '@label' => $service->label(),
        '@group' => $service->getGroup(),
      ]);
    }
    natcasesort($options);

    $form['cookies'] = [
      '#type' => 'details',
      '#title' => $this->t('Cookie consent'),
      '#open' => TRUE,
      '#description' => $this->t('The Clarity tag is withheld until the visitor accepts the Microsoft Clarity service, and the decision is passed on through the Clarity Consent API.'),
    ];

    $form['cookies']['ad_storage_service'] = [
      '#type' => 'select',
      '#title' => $this->t('Service governing ad storage'),
      '#options' => ['' => $this->t('- None, always deny -')] + $options,
      '#default_value' => $this->configFactory->get('cookies_microsoft_clarity.settings')->get('ad_storage_service'),
      '#description' => $this->t('Clarity asks for two separate signals. Analytics storage always follows the Microsoft Clarity service. Ad storage is denied unless you point it at a service here, which is only appropriate if you use Clarity together with Microsoft Advertising and the chosen service tells visitors so.'),
    ];

    // Appending here runs after the form object's own submitForm(). Setting
    // #submit on the button instead would replace it.
    // @see \Drupal\Core\Form\FormBuilder::prepareForm()
    $form['#submit'][] = '_cookies_microsoft_clarity_settings_submit';
  }

}
