<?php

namespace Drupal\case_studies\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Twig\Environment;

/**
 * CaseStudiesController that extends ControllerBase.
 */
class CaseStudiesController extends ControllerBase {

  /**
   * The Twig environment.
   *
   * @var \Twig\Environment
   */
  protected $twig;

  /**
   * Constructs a new ExampleController object.
   *
   * @param \Twig\Environment $twig
   *   The Twig environment.
   */
  public function __construct(Environment $twig) {
    $this->twig = $twig;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('twig')
    );
  }

  /**
   * Display markup takes page name, returns Case Study Page.
   *
   * @param string $template
   *   $Template is template name provided by dynamic route.
   *
   * @return array
   *   A render array
   */
  public function displayMarkup($template) {
    try {
      $template = $this->twig->load('@case_studies/pages/' . $template . '.html.twig');
      $markup = $template->render();
      return [
        '#type' => 'inline_template',
        '#template' => $markup,
        '#attached' => [
          'library' => [
            'case_studies/case_studies_styles',
          ],
        ],
      ];
    }
    catch (\Exception $e) {
      http_response_code(404);
      // Terminate further processing and return the 404 status code.
      throw new NotFoundHttpException();
    }
  }

}
