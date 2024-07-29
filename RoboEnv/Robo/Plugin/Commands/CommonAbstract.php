<?php

namespace RoboEnv\Robo\Plugin\Commands;

use Robo\Tasks;

/**
 * Provides functionality that must be implemented by plugins.
 *
 * @class RoboFile
 */
abstract class CommonAbstract extends Tasks
{
    use CommonTrait;

    /**
     * Get the unique name for an environment.
     *
     * @return string
     */
    abstract protected function getName(): string;

    /**
     * Retrieve the path to composer inside and outside the environment.
     *
     * @param $inside
     *   If inside the environment.
     *
     * @return string
     */
    abstract public static function composerCommand(bool $inside = TRUE): string;

    /**
     * Retrieve the path to composer inside and outside the environment.
     *
     * @param $inside
     *   If inside the environment.
     *
     * @return string
     */
    abstract public static function drushCommand(bool $inside = TRUE): string;

}
