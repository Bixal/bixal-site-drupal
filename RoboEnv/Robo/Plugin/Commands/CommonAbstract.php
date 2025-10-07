<?php

namespace RoboEnv\Robo\Plugin\Commands;

use Robo\Tasks;
use Symfony\Component\Console\Style\SymfonyStyle;

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
    abstract public static function getName(): string;

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

    /**
     * Retrieve the path to execute a command inside the environment.
     *
     * @param $inside
     *   If inside the environment.
     *
     * @return string
     */
    abstract public static function execCommand(bool $inside = TRUE): string;

    /**
     * Is the current local environment ready to start?
     *
     * @param bool $return
     *   If true, returns false instead of an exception.
     *
     * @return bool
     *
     * @throws \Exception
     */
    abstract protected function isInit(bool $return = false): bool;

    /**
     * Helper to allow for fast rebuild.
     *
     * @param bool $rebuild_required
     *   If true, a "confirm" will be shown to rebuild.
     *
     * @return void
     */
    abstract protected function rebuildRequired(SymfonyStyle $io, bool $rebuild_required, string $confirm_message = ''): void;

}
