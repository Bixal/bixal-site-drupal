<?php

namespace RoboEnv\Robo\Plugin\Commands;

use Robo\Tasks;
use Symfony\Component\Yaml\Yaml;

/**
 * Back up and restore the local database.
 *
 * Uses ddev snapshots on ddev, otherwise drush sql:dump files.
 *
 * @class RoboFile
 */
class DbCommands extends Tasks
{
    /**
     * Back up the database.
     *
     * @command db:backup
     *
     * @param string $id
     *    The ddev snapshot name, or the dump file name without .sql.
     *
     * @option dir Where drush dumps are saved, not used on ddev.
     *
     * @return void
     *
     * @throws \Exception
     */
    public function dbBackup(string $id, array $opts = ['dir' => '']): void
    {
        if ($this->isDdev()) {
            $this->execOrFail('ddev snapshot --name=' . escapeshellarg($id));
        } else {
            // Dump through stdout so the file is written on the host, not in
            // the container.
            $this->execOrFail('./drush.sh sql:dump > ' . escapeshellarg($this->dumpFile($id, $opts['dir'])));
        }
    }

    /**
     * Restore a database backed up with db:backup.
     *
     * @command db:restore
     *
     * @param string $id
     *    The ddev snapshot name, or the dump file name without .sql.
     *
     * @option dir Where drush dumps are saved, not used on ddev.
     *
     * @return void
     *
     * @throws \Exception
     */
    public function dbRestore(string $id, array $opts = ['dir' => '']): void
    {
        if ($this->isDdev()) {
            // Restoring restarts the project, skip the post-start hooks so the
            // code and front end are not rebuilt. Still run the one that
            // removes what ddev appends to settings.php on start.
            $this->execOrFail('ddev snapshot restore --skip-hooks ' . escapeshellarg($id));
            $this->execOrFail('./robo.sh common:remove-settings-php-changes');
        } else {
            $file = $this->dumpFile($id, $opts['dir']);
            if (!is_file($file)) {
                throw new \Exception("No database backup found at $file.");
            }
            $this->execOrFail('./drush.sh sql:drop -y');
            $this->execOrFail('./drush.sh sql:cli < ' . escapeshellarg($file));
        }
    }

    /**
     * Delete a database backed up with db:backup.
     *
     * @command db:delete
     *
     * @param string $id
     *    The ddev snapshot name, or the dump file name without .sql.
     *
     * @option dir Where drush dumps are saved, not used on ddev.
     *
     * @return void
     *
     * @throws \Exception
     */
    public function dbDelete(string $id, array $opts = ['dir' => '']): void
    {
        if ($this->isDdev()) {
            $this->execOrFail('ddev snapshot --cleanup -y --name=' . escapeshellarg($id));
        } else {
            $file = $this->dumpFile($id, $opts['dir']);
            if (is_file($file)) {
                unlink($file);
            }
        }
    }

    /**
     * Is ddev the default local environment?
     *
     * @return bool
     *
     * @throws \Exception
     */
    protected function isDdev(): bool
    {
        // Read the drupal-env config directly instead of using CommonTrait.
        // That trait is scaffolded (gitignored), and Robo loads every class
        // in this directory during the drupal-scaffold pre hook, before it
        // exists, so depending on it here is a fatal error on a fresh clone.
        $file = 'roboConfDrupalEnv.local.yml';
        $config = file_exists($file) ? (Yaml::parseFile($file) ?? []) : [];
        $name = $config['flags']['common']['defaultLocalEnvironment']['name'] ?? null;
        if ($name === null) {
            throw new \Exception('Cannot call this until the local environment has been initialized.');
        }
        return $name === 'ddev';
    }

    /**
     * The path to a drush dump.
     *
     * @param string $id
     * @param string $dir
     *    The directory, or empty for one in the system temp directory.
     *
     * @return string
     */
    protected function dumpFile(string $id, string $dir): string
    {
        if ($dir === '') {
            $dir = sys_get_temp_dir() . '/' . basename(getcwd()) . '-db-backups';
            if (!is_dir($dir)) {
                mkdir($dir, 0700, true);
            }
        }
        return "$dir/$id.sql";
    }

    /**
     * Run a command, throwing an exception if it fails.
     *
     * @param string $command
     *
     * @return void
     *
     * @throws \Exception
     */
    protected function execOrFail(string $command): void
    {
        if (!$this->taskExec($command)->run()->wasSuccessful()) {
            throw new \Exception("Command failed: $command");
        }
    }

}
