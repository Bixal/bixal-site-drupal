<?php

namespace RoboEnv\Robo\Plugin\Commands;

use Dflydev\DotAccessData\Data;
use Composer\InstalledVersions;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Yaml\Yaml;

/**
 * Provides common functionality that all plugins can use.
 */
trait CommonTrait
{

    /**
     * Just stop the program to show a message.
     *
     * @param string $message
     *   A message to show.
     *
     * @return void
     */
    protected function enterToContinue(SymfonyStyle $io, string $message): void
    {
        $io->askQuestion(new Question($message, 'Enter to continue, no input required'));
    }

    /**
     * Introduce user's to the common shortcuts.
     *
     * @param bool $run_only_once
     *   This will do nothing if true and it has been run.
     *
     * @return void
     */
    protected function introduceCommonShortcuts(SymfonyStyle $io, bool $run_only_once = true): void
    {
        if ($run_only_once && $this->getConfig('flags.common.introducedToCommonShortcuts', false, true)) {
            return;
        }
        $this->saveConfig('flags.common.introducedToCommonShortcuts', true, true);
        $this->enterToContinue($io, 'You will now be stepped through the common shortcuts that are available to you.');
        $io->comment('./robo.sh: (https://github.com/consolidation/robo) This project is a task runner like gulp, but for PHP. It is used in place of bash scripts to interact with the environment. It will always run through your local machine\'s PHP (8.1+).');
        $io->comment('./composer.sh: (https://getcomposer.org/) This allows you to use interact with your environment\'s dependencies. It should always be used instead any other composer because it writes to a custom "composer.log" file that documents all composer commands that change the contents of your composer.lock. This makes it easier to solve merge conflicts.');
        $io->comment('./php.sh: (https://www.php.net/) Allows you to choose a PHP version on your machine that may be required by a project in case you have multiple installed or need multiple.');
        $io->comment('./drush.sh: (https://www.drush.org) Allows you to interact with your local environment\'s installation of Drupal. Therefore, a local environment must be installed, configured, and a site installed in order to work.');
        if (empty($this->getConfig('flags.common.paths.composer', [], true))) {
            $this->enterToContinue(
                $io,
                'You will now be stepped through configuring where composer AND php (if you have not already) live for your project, PHP must exist on your local machine but you can optionally choose Composer from your local environment (as long as a local exists) or Docker, but it is recommended to install Composer (2) locally (speed).'
            );
            $this->_exec('./composer.sh --version');
        }
        $this->enterToContinue($io, 'If you would like to reset your path selections or get this message again, please run "./robo.sh common:shortcuts-help".');
        if ($io->confirm('Would you like to be able to type shortcuts like `composer` instead of `./composer.sh`?')) {
            $this->_exec('./robo.sh common:shortcuts-aliases');
        }
        $this->enterToContinue($io, 'If you would like to see these aliases again, please run "./robo.sh common:shortcuts-aliases".');
    }

    /**
     * Create a v4 UUID.
     *
     * @param string|null $data
     *   Optional 16 characters random data. Will cause non-random UUID return.
     *
     * @return string
     *   A v4 UUID.
     */
    protected function genUuidV4(?string $data = null): string
    {
        // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
        $data = $data ?? random_bytes(16);
        assert(strlen($data) == 16);

        // Set version to 0100
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        // Set bits 6-7 to 10
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        // Output the 36 character UUID.
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    /**
     * Save the $file_contents to $file_path.
     *
     * @param string $file_path
     *   The path to the file to be saved.
     * @param array|string $file_contents
     *   A string of yaml or an array.
     *
     * @return bool
     */
    protected function saveYml(string $file_path, array|string $file_contents): bool
    {
        // Ensure a YML string is still valid.
        if (is_string($file_contents)) {
            Yaml::parse($file_contents);
        }
        return (bool) file_put_contents($file_path, Yaml::dump($file_contents, 5, 2));
    }

    /**
     * Save a key to the config.
     *
     * @param string $key
     * @param mixed $value
     * @param bool $local
     *
     * @return bool
     */
    protected function saveConfig(string $key, mixed $value, bool $local = false): bool
    {
        [$config_file, $config_data] = $this->switchConfig($local);
        $config_data->set($key, $value);
        $config_data_string = $config_data->export();
        return $this->saveYml($config_file, $config_data_string);
    }

    /**
     * Get a config value.
     *
     * @param string $key
     * @param null $default
     * @param bool $local
     *
     * @return mixed
     */
    protected function getConfig(string $key, $default = NULL, bool $local = false): mixed
    {
        [$config_file, $config_data] = $this->switchConfig($local);
        return $config_data->get($key, $default);
    }

    /**
     * Switch between the active config.
     *
     * @param bool $local
     *
     * @return array
     */
    protected function switchConfig(bool $local = false): array
    {
        if ($local) {
            $config_file = 'roboConfDrupalEnv.local.yml';
        } else {
            $config_file = 'roboConfDrupalEnv.yml';
        }
        if (file_exists($config_file)) {
            $config = Yaml::parse(file_get_contents($config_file)) ?? [];
        } else {
            $config = [];
        }
        return [$config_file, new Data($config)];
    }

    /**
     * Call the local environment method for command $name.
     *
     * @param string $name
     *   The name of the command.
     * @param bool $inside
     *   Are we inside the local env?
     *
     * @return string
     */
    protected function getLocalEnvCommand(string $name, bool $inside = true): string
    {
        return call_user_func_array([$this->getDefaultLocalEnvironment()['commands_class'], $name . 'Command'], [$inside]);
    }

    /**
     * Set the default local environment so commands can be routed.
     *
     * @param string $name
     *
     * @return void
     */
    protected function setDefaultLocalEnvironment(string $name): void
    {
        $this->saveConfig('flags.common.defaultLocalEnvironment.name', $name, true);
        $this->saveConfig('flags.common.defaultLocalEnvironment.commands_class', static::class, true);
    }

    /**
     * Retrieve the current default local environment.
     *
     * @return array
     *
     * @throws \Exception
     */
    protected function getDefaultLocalEnvironment(): array
    {
        $config = $this->getConfig('flags.common.defaultLocalEnvironment', [], true);
        if (empty($config)) {
            throw new \Exception('Cannot call this until the local environment has been initialized.');
        }
        return $config;
    }

    /**
     * Has a default local environment been chosen?
     */
    protected function isDefaultLocalEnvironmentSet(): bool
    {
        try {
            $this->getDefaultLocalEnvironment();
            return true;
        } catch (\Exception $exception) {
            return false;
        }
    }

    /**
     * Get the path to the bin on the machine.
     *
     * @param string $name
     *   The executable name.
     *
     * @return null|string
     *   Null if not found.
     */
    protected function executableFilePath(string $name): ?string
    {
        $command = sprintf('which %s', escapeshellarg($name));
        $file_path = shell_exec($command);
        if (!empty($file_path)) {
            return trim($file_path);
        }
        return NULL;
    }

    /**
     * The headers of the software requirements table.
     *
     * @return string[]
     */
    protected function softwareTableHeaders(): array
    {
        return [
            'name' => 'Name',
            'bin' => 'Bin Searched',
            'file_path' => 'Found At',
            'download' => 'Download',
            'requirements' => 'Requirements'
        ];
    }

    /**
     * Adds a new software requirement to the table.
     *
     * @param string $name
     *   The software's name.
     * @param string $bin
     *   The binary name.
     * @param string $download
     *   The path to download the software package.
     * @param string $requirements
     *   The path to see the requirements for the software package.
     * @param array $rows
     *   All current rows plus the new.
     *
     * @return bool
     *   False if the software cannot be found on the current machine.
     */
    protected function addSoftwareTableRow(string $name, string $bin, string $download, string $requirements, array &$rows): bool
    {
        $row = $this->softwareTableHeaders();
        $row['name'] = $name;
        $row['bin'] = $bin;
        $file_path = $this->executableFilePath($bin);
        $row['file_path'] = $file_path ?? '!!! Does not exist !!!';
        $row['download'] = $download;
        $row['requirements'] = $requirements;
        $rows[] = $row;
        return $file_path !== NULL;
    }

    /**
     * Print out the software requirements table.
     *
     * @param array $rows
     *   All rows of the table.
     * @param bool $missing_software
     *   If any of the rows were missing on the current machine.
     *
     * @return void
     *
     * @throws \Exception
     */
    protected function printSoftWareTable(SymfonyStyle $io, array $rows, bool $missing_software): void
    {
        $io->table($this->softwareTableHeaders(), $rows);
        if ($missing_software) {
            throw new \Exception('You are missing a piece of software, please download and re-run.');
        }
        else {
            $io->success('All software found.');
        }
    }



    /**
     * Determine the path to $name.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     * @param $name
     *   The name of the binary.
     * @param $docker_run
     *   The fallback docker run command to use $name.
     *
     * @return string
     *   The full path to the binary.
     *
     * @throws \Exception
     */
    protected function getBinaryLocation(SymfonyStyle $io, $name, string $docker_run = '', $local_machine_allowed = true): string
    {
        // If inside the local environment, always run that local environments
        // internal command.
        if (FALSE !== getenv('DRUPAL_ENV_LOCAL')) {
            return $this->getLocalEnvCommand($name);
            // @TODO add remote command here.
            //} elseif (FALSE !== getenv('DRUPAL_ENV_REMOTE')) {
            //    return $this->getRemoteEnvCommand('composer');
            // If not inside the local env or the remote env, only allow calls to
            // to local env  if $local_machine_allowed is false. For example, from
            // local machine, you can only run drush through your local env.
        } elseif (!$local_machine_allowed) {
            return $this->getLocalEnvCommand($name, false);
        }
        // If not local or remote, then prompt the user how they want to access
        // the binary.
        return $this->askForBinaryLocation($io, $name, $docker_run);
    }

    /**
     * Ask the user how they want their local to use $name.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     * @param $name
     *   The name of the binary.
     * @param $docker_run
     *   The fallback docker run command to use $name.
     *
     * @return string
     *   The full path to the binary.
     *
     * @throws \Exception
     */
    protected function askForBinaryLocation(SymfonyStyle $io, $name, string $docker_run = ''): string
    {
        // This flag stores how their local should access composer.
        $flag_name = 'flags.common.paths.' . $name;
        $path_config = $this->getConfig($flag_name, [], true);
        // If false, this means to use the local and we're not inside the
        // environment right now.
        if (!empty($path_config)) {
            switch ($path_config['type']) {
                case 'local_environment':
                    return $this->getLocalEnvCommand('composer', false);

                case 'local_machine':
                    if (!empty($path_config['path']) && $this->executableFilePath($path_config['path'])) {
                        return $path_config['path'];
                    }
                    $path = $path_config['path'] ?? '<not set>';
                    $io->warning("Your path to $name ({$path}) no longer exists.");
                    break;

                case 'docker':
                    return $docker_run;

            }
        }

        $io->warning("You have not chosen where $name lives on your system yet.");

        $io->note("Running $name on your own machine is usually faster than running through docker.");
        $choice = $io->choice(
            "Would you like to run $name from your local machine, through your local environment (usually uses docker), or directly through docker?",
            ['Local Machine', 'Local Environment', 'Docker']
        );
        switch ($choice) {
            case 'Local Machine':
                $default_full_path = $this->executableFilePath($name);
                $io->note("Showing possible locations for $name");
                $this->_exec("whereis $name");
                $binary_location = $io->ask("Enter the full path to $name", $default_full_path);
                if (!strlen($name)) {
                    throw new \Exception('A path is required.');
                }
                if (!$this->executableFilePath($binary_location)) {
                    throw new \Exception("The path '$binary_location' does not exist on your machine.");
                }
                $this->saveConfig($flag_name, ['type' => 'local_machine', 'path' => $binary_location], true);
                return $binary_location;

            case 'Local Environment':
                $this->saveConfig($flag_name, ['type' => 'local_environment'], true);
                return $this->getLocalEnvCommand('composer', false);

            case 'Docker':
                if ($this->executableFilePath('docker')) {
                    $this->saveConfig($flag_name, ['type' => 'docker'], true);
                    return $docker_run;
                } else {
                    throw new \Exception('Docker could not be found on your system.');
                }

        }
        throw new \Exception("Invalid operation when choosing path to $name");
    }

    /**
     * Check if Drupal is installed.
     *
     * @return bool
     *
     * @throws \Exception
     */
    protected function isDrupalInstalled(SymfonyStyle $io, bool $return = false): bool {
        $result = $this->drush($io, ['status', '--fields=bootstrap'], ['print_output' => false]);
        $installed = $result->getMessage() === 'Drupal bootstrap : Successful';
        if ($return) {
            return $installed;
        }
        if (!$installed) {
            throw new \Exception('Drupal is not installed or the environment is not started.');
        }
        return true;
    }


    /**
     * Is the $project installed in Composer?
     *
     * @param string $project
     *
     * @return bool
     */
    protected function isDependencyInstalled(string $project): bool
    {
        // Remove the version constraint if it has one.
        [$project] = explode(':', $project);
        exec("./composer.sh show $project > /dev/null 2>&1", $output, $exitCode);
        return !$exitCode;
    }

    /**
     * Is a module enabled?
     *
     * @param string $module
     *   A module name.
     *
     * @return bool
     */
    protected function isModuleEnabled(string $module): bool
    {
        return '1' === $this->taskExec(
                sprintf('./drush.sh php-eval "echo \Drupal::moduleHandler()->moduleExists(\'%s\');"', $module)
            )
                ->printOutput(false)
                ->run()
                ->getMessage();
    }

    /**
     * Install one or more dependencies.
     *
     * @param SymfonyStyle $io
     * @param bool $ask_before_install
     *   If true, ask before installing.
     * @param array $projects
     *   An array with keys of project name and description values.
     * @param bool $dev_dep
     *   If true, all $projects will be installed as dev dependencies.
     * @param bool $ask_dev_dep
     *   If true, it will ask for each dep if it should be a dev dep.
     *
     * @return bool
     *   True if there was no error.
     */
    protected function installDependencies(SymfonyStyle $io, bool $ask_before_install, array $projects = [], bool $dev_dep = false, bool $ask_dev_dep = false): bool
    {
        if (!$ask_before_install && $ask_dev_dep) {
            throw new \Exception('You must ask before install if you want to ask for a dev dependency.');
        }
        $_self = $this;
        $not_installed_projects = array_filter($projects, static function (string $key) use ($projects, $_self): bool {
            return !$_self->isDependencyInstalled($key);
        }, ARRAY_FILTER_USE_KEY);
        // All installed, nothing to do.
        if (empty($not_installed_projects)) {
            return true;
        }
        if ($ask_before_install) {
            $install_projects = [];
            $install_projects_dev = [];
            foreach ($not_installed_projects as $not_installed_project => $description) {
                $dev_dep_label = '';
                if ($dev_dep && !$ask_dev_dep) {
                    $dev_dep_label = ' (Development only dependency)';
                }
                if ($io->confirm("Would you like to install $not_installed_project$dev_dep_label? $description")) {
                    if ($dev_dep_label || ($ask_dev_dep && $io->confirm('Would you like this to be a dev only dependency?', $dev_dep))) {
                        $install_projects_dev[] = $not_installed_project;
                    }
                    else {
                        $install_projects[] = $not_installed_project;
                    }
                }
            }
        } else {
            if ($dev_dep) {
                $install_projects_dev = array_keys($not_installed_projects);
            } else {
                $install_projects = array_keys($not_installed_projects);
            }
        }
        $success = [];
        $enable_modules = [];
        if (!empty($install_projects)) {
            $command = $this->taskComposerRequire('./composer.sh')->arg('-W');
            foreach ($install_projects as $install_project) {
                $this->yell("Installing $install_project");
                $command->dependency($install_project);
            }
            $success[] = $command->run()->wasSuccessful();
            $enable_modules = array_merge($this->composerDependenciesToDrupalModuleName($install_projects), $enable_modules);
        }
        if (!empty($install_projects_dev)) {
            $command = $this->taskComposerRequire('./composer.sh')->arg('-W');
            foreach ($install_projects_dev as $install_project_dev) {
                $this->yell("Installing $install_project_dev as a development only dependency");
                $command->dependency($install_project_dev);
            }
            $success[] = $command->dev()->run()->wasSuccessful();
            $enable_modules = array_merge($this->composerDependenciesToDrupalModuleName($install_projects_dev), $enable_modules);
        }
        // If a local has not been set up, no need to enable.
        if (!$this->isDefaultLocalEnvironmentSet()) {
            $enable_modules = [];
        }
        // Only enable modules that are not already enabled.
        foreach ($enable_modules as $key => $module) {
            if ($this->isModuleEnabled($module)) {
                unset($enable_modules[$key]);
            }
        }
        if (!empty($enable_modules)) {
            $success[] = $this->drush($io, [
                'en',
                '-y',
                implode(', ', $enable_modules)
            ])->wasSuccessful();
        }
        return !in_array(false, $success);
    }

    /**
     * Remove a composer dependency.
     *
     * @param $project
     *   A composer dependency.
     *
     * @return bool
     * @throws \Exception
     */
    protected function uninstallDependency(SymfonyStyle $io, $project): bool
    {
        // Remove the version constraint if it has one.
        [$project] = explode(':', $project);
        $success = true;
        $module_name = $this->composerDependenciesToDrupalModuleName([$project]);
        $module_name = end($module_name);
        // If project is equal to module name, then they just passed a module.
        // Therefore, only the module uninstallation has to happen.
        if ($project !== $module_name && !$this->isDependencyInstalled($project)) {
            return $success;
        }
        if ($this->isModuleEnabled($module_name)) {
            $success = $this->drush($io, ['pm-uninstall', '-y', $module_name])
                ->wasSuccessful();
        }
        if ($project !== $module_name && $io->confirm('Would you like to remove the "' . $project . '" composer dependency right now? Only do so right away if this module is not enabled on production, otherwise, you will get errors when trying to uninstall and removing the dependency at the same time.')) {
            $success = $this->taskComposerRemove('./composer.sh')->arg($project)->run()->wasSuccessful();
        }
        return $success;
    }

    /**
     * Filter a list a composer deps to only the module name.
     *
     * @param array $projects
     *   A list of composer deps.
     *
     * @return array
     */
    protected function composerDependenciesToDrupalModuleName(array $projects): array
    {
        $return = [];
        foreach ($projects as $project) {
            if (str_contains($project, '/')) {
                [$vendor, $name] = explode('/', $project);
            } else {
                // If no vendor was given in the project, it's a drupal core
                // module
                $vendor = 'drupal';
                $name = $project;
            }
            if (!str_contains($name, ":")) {
                $name .= ":";
            }
            [$name, $stability] = explode(':', $name);
            if ($vendor === 'drupal') {
                $return[] = $name;
            }
        }
        return $return;
    }

    /**
     * Remove changes to settings.php
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     *
     * @return void
     */
    protected function removeSettingsPhpChanges(SymfonyStyle $io): void
    {
        $path_to_package = InstalledVersions::getInstallPath('mattsqd/drupal-env');
        if (!is_dir($path_to_package)) {
            return;
        }
        $path_to_marker = $path_to_package . '/scaffolding/drupal_config/settings_additions.php';
        if (!is_readable($path_to_marker)) {
            return;
        }
        // Read as array of lines
        $file = file($path_to_marker);

        // The last line in the additions should be the last line in settings.php.
        $marker = end($file);

        $file = 'web/sites/default/settings.php';

        // Read as array of lines
        $content = file($file);
        $newContent = [];

        $after_end = false;
        $lines_to_remove = [];
        foreach ($content as $line) {
            if (str_starts_with($line, $marker)) {
                // Leave what should have been the last line.
                $newContent[] = $line;
                $after_end = true;
            }
            elseif (!$after_end) {
                $newContent[] = $line;
            } else {
                $lines_to_remove[] = $line;
            }
        }
        if ($lines_to_remove) {
            $io->warning('The last line of settings.php should be an include to settings.drupal_env.php. It ensures that local settings and environment specific settings are loaded. If the additions are required and not found in settings.drupal_env.php, please add them manually.');
            $io->warning('The following lines were removed from settings.php:');
            $io->writeln(implode('', $lines_to_remove));
            $io->warning('End lines removed from settings.php');
            // Removing trailing space and add a single new line to end.
            file_put_contents($file, rtrim(implode('', $newContent)). "\n");
        }
    }

    /**
     * Act when a shared service is modified.
     *
     * @param string $service_type
     *   The service name.
     *
     * @param bool|null $status
     *   False if nothing changes. True if new service added. Null if service
     *   removed.
     *
     * @return void
     *
     * @throws \Exception
     */
    protected function reactToSharedService(SymfonyStyle $io, string $service_type, bool|null $status = false): void
    {
        // Stayed the same.
        if ($status === false) {
            return;
        }
        $add = true;
        // Service is being removed.
        if ($status === null) {
            $add = false;
        }
        $self = $this;
        $add_or_remove_module = static function(string $project, array $additional_uninstall = []) use($add, $self, $io): void {
            if ($add) {
                $self->installDependencies($io, false, [$project => '']);
            } else {
                $additional_uninstall[] = $project;
                foreach ($additional_uninstall as $project) {
                    $self->uninstallDependency($io, $project);
                }
                // After uninstalling, it's a good idea to purge cache.
                $self->drush($io, ['cache-rebuild']);
            }
        };
        switch ($service_type) {
            case 'memcached':
                $add_or_remove_module('drupal/memcache');
                break;

            case 'redis':
                $add_or_remove_module('drupal/redis');
                break;

            case 'solr':
            case 'drupal-solr':
                // Search API gets turned on at the same time as solr, uninstall
                // it too.
                $add_or_remove_module('drupal/search_api_solr', ['search_api']);
                if ($add) {
                    $this->yell('IMPORTANT MANUAL CONFIGURATION:');
                    $this->yell("The Search API Solr module has been added and enabled, but you must manually create the core at /admin/config/search/search-api/add-server. Guidelines: The machine name MUST be 'default_solr_server'; The 'Solr Connector' MUST be 'standard'; 'Solr core' must be set, but the value does not matter; All other values can be updated as you see fit.");
                    $env = $this->getDefaultLocalEnvironment()['name'];
                    $this->enterToContinue($io, "Once the above has been completed, you can run the command `./robo.sh $env-admin:solr-config` to put the Solr configuration in place. The environment must be rebuilt before this can be run.");
                }
                break;

            case 'elasticsearch':
                // Search API gets turned on at the same time as
                // elasticsearch_connector, uninstall it too.
                $add_or_remove_module('drupal/elasticsearch_connector:@dev', ['search_api']);
                if ($add) {
                    $this->yell('IMPORTANT MANUAL CONFIGURATION:');
                    $this->enterToContinue($io, "The Elasticsearch Connector module has been added and enabled, but you must manually create the core at /admin/config/search/search-api/add-server. Guidelines: The machine name MUST be 'default_elasticsearch_server'; The 'ElasticSearch Connector' MUST be 'standard'; 'ElasticSearch URL' must be set, but the value does not matter; All other values can be updated as you see fit.");
                }
                break;

            case 'node':
                if ($add) {
                    $this->enterToContinue($io, 'If you need to take action during the build process, please edit the "./orch/build_node.sh" file. By default, this file will install deps with npm and run "gulp" on all custom themes that have a package.json.');
                }
                break;

        }
    }

}
