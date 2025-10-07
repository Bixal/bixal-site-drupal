<?php

namespace Drupal\media_remote_hls\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\media_remote\Plugin\Field\FieldFormatter\MediaRemoteFormatterBase;

/**
 * Plugin implementation of media_remote_hls formatter.
 *
 * @FieldFormatter(
 *   id = "media_remote_hls",
 *   label = @Translation("Remote Media - HLS"),
 *   field_types = {
 *     "string"
 *   }
 * )
 */
class MediaRemoteHLSFormatter extends MediaRemoteFormatterBase {

  /**
   * {@inheritdoc}
   */
  public static function getUrlRegexPattern() {
    return '/^https?:\/\/.*\/(.*)\.m3u8/';
  }

  /**
   * {@inheritdoc}
   */
  public static function getValidUrlExampleStrings(): array {
    return [
      'https://hls.example.org/abacab/abacab.m3u8',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public static function deriveMediaDefaultNameFromUrl($url) {
    $matches = [];
    $pattern = static::getUrlRegexPattern();
    preg_match_all($pattern, $url, $matches);
    if (!empty($matches[1][0])) {
      return t('HLS video from @url', [
        '@url' => $url,
      ]);
    }
    return parent::deriveMediaDefaultNameFromUrl($url);
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];
    foreach ($items as $delta => $item) {
      /** @var \Drupal\Core\Field\FieldItemInterface $item */
      if ($item->isEmpty()) {
        continue;
      }
      $matches = [];
      $pattern = static::getUrlRegexPattern();
      preg_match_all($pattern, $item->value, $matches);
      if (empty($matches[1][0])) {
        continue;
      }
      $elements[$delta] = [
        '#theme' => 'media_remote_hls',
        '#url' => $item->value,
        '#width' => $this->getSetting('width') ?? 960,
        '#height' => $this->getSetting('height') ?? 600,
        '#autoplay' => $this->getSetting('autoplay') ? "autoplay" : NULL,
      ];
    }
    if ($elements) {
      $elements['#attached']['library'][] = 'media_remote_hls/videojs';
    }
    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'width' => 960,
      'height' => 600,
      'autoplay' => FALSE,
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    return parent::settingsForm($form, $form_state) + [
      'width' => [
        '#type' => 'number',
        '#title' => $this->t('Width'),
        '#default_value' => $this->getSetting('width'),
        '#size' => 5,
        '#maxlength' => 5,
        '#field_suffix' => $this->t('pixels'),
        '#min' => 50,
      ],
      'height' => [
        '#type' => 'number',
        '#title' => $this->t('Height'),
        '#default_value' => $this->getSetting('height'),
        '#size' => 5,
        '#maxlength' => 5,
        '#field_suffix' => $this->t('pixels'),
        '#min' => 50,
      ],
      'autoplay' => [
        '#type' => 'checkbox',
        '#title' => $this->t('Autoplay'),
        '#default_value' => $this->getSetting('autoplay'),
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = parent::settingsSummary();
    $summary[] = $this->t('Video element size: %width x %height pixels<br>@autoplay', [
      '%width' => $this->getSetting('width'),
      '%height' => $this->getSetting('height'),
      '@autoplay' => $this->getSetting('autoplay') ? 'autoplay' : '',
    ]);
    return $summary;
  }

}
