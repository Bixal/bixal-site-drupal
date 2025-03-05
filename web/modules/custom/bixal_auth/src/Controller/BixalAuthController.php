<?php

declare(strict_types=1);

namespace Drupal\bixal_auth\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Returns responses for Bixal Auth routes.
 */
final class BixalAuthController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function __invoke(): Response {

    if ($this->currentUser()->isAnonymous()) {
      throw new AccessDeniedHttpException('Only authenticated users can access this page.');
    }

    // Users with roles besides 'authenticated'.
    if (count($this->currentUser()->getRoles()) > 1) {
      $url = Url::fromRoute('system.admin_content');
    }
    else {
      $url = Url::fromRoute('entity.webform.canonical', ['webform' => 'request_a_role']);
    }
    return new RedirectResponse($url->toString());
  }

}
