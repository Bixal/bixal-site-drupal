<?php

namespace RoboEnv\Robo\Plugin\Commands;

use Robo\Result;
use Robo\Tasks;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Run common orchestration tasks and provides shared helper methods.
 *
 * This does not extend AbstractCommands, because it is not one of the
 * 'plugins'. It does include the CommonTrait, however, like the plugins do.
 *
 * @class RoboFile
 */
class CommonCommands extends Tasks
{
    use CommonTrait;

    /**
     * Add the server required to make Xdebug work in PhpStorm.
     *
     * This works with /.run/appserver.run.xml to allow Xdebug to work.
     *
     * @command xdebug:phpstorm-debug-config
     */
    public function xdebugPhpstormDebugConfig(): void
    {
        if (!class_exists('DOMDocument')) {
            throw new \Exception('Your local PHP must have the "dom" extension installed.');
        }
        $xml = new \DOMDocument('1.0', 'UTF-8');
        $xml->preserveWhiteSpace = TRUE;

        if (!@$xml->load(".idea/php.xml")) {
            throw new \Exception('Are you sure your using PhpStorm? There is no /.idea/php.xml file.');
        }
        $components = $xml->getElementsByTagName("component");
        /** @var \DOMElement $row */
        foreach ($components as $row) {
            if ($row->getAttribute('name') === 'PhpProjectServersManager') {
                throw new \Exception('Xdebug is already configured');
            }
        }
        /* Append a component that looks something like:
        <component name="PhpProjectServersManager">
          <servers>
            <server host="doesnotmatter.com" id="fdf5bc85-858f-4732-ba1d-29be7676b0a3" name="appserver" use_path_mappings="true">
              <path_mappings>
                <mapping local-root="$PROJECT_DIR$" remote-root="/app" />
              </path_mappings>
            </server>
          </servers>
        </component>
        */

        $project = $xml->getElementsByTagName('project');

        $mapping = $xml->createElement('mapping', '');
        $mapping->setAttribute('local-root', '$PROJECT_DIR$');
        $mapping->setAttribute('remote-root', '/app');

        $path_mappings = $xml->createElement('path_mappings', '');

        $path_mappings->appendChild($mapping);

        $server = $xml->createElement('server', '');
        $server->setAttribute('host', 'doesnotmatter.com');
        $server->setAttribute('id', $this->genUuidV4());
        $server->setAttribute('name', 'appserver');
        $server->setAttribute('use_path_mappings', 'true');

        $server->appendChild($path_mappings);

        $servers = $xml->createElement('servers', '');

        $servers->appendChild($server);

        $component = $xml->createElement('component');
        $component->setAttribute('name', 'PhpProjectServersManager');

        $component->appendChild($servers);

        $project->item(0)->appendChild($component);
        $xml->save('.idea/php.xml');

    }

    /**
     * Call drush for your local environment.
     *
     * @command common:drush
     *
     * @param array $args
     *   All arguments and options passed to drush.
     * @param array $exec_options
     *   Additional options passed to the robo taskExec().
     *
     * @return \Robo\Result
     *
     * @throws \Exception
     */
    public function drush(SymfonyStyle $io, array $args, array $exec_options = ['print_output' => true]): Result
    {
        $path_to_drush = $this->commonGetDrushPath($io);
        $task = $this->taskExec($path_to_drush);
        if (!empty($args)) {
            $task->args($args);
        }
        return $task
            ->printOutput($exec_options['print_output'])
            ->run();
    }

    /**
     * Get the path to Drush.
     *
     * @command common:drush-path
     *
     * @throws \Exception
     */
    public function commonGetDrushPath(SymfonyStyle $io): string
    {
        return $this->getBinaryLocation($io, 'drush', '', false);
    }

    /**
     * Call composer on the local machine.
     *
     * @command common:composer
     *
     * @param array $args
     *    All arguments and options passed to composer.
     * @param array $exec_options
     *    Additional options passed to the robo taskExec().
     *
     * @return \Robo\Result
     *
     * @throws \Exception
     */
    public function composer(SymfonyStyle $io, array $args, array $exec_options = ['print_output' => true]): Result
    {
        $path_to_composer = $this->getBinaryLocation($io, 'composer', 'docker run --rm -i --tty -v $PWD:/app composer:2');
        $task = $this->taskExec($path_to_composer);
        if (!empty($args)) {
            $task->args($args);
        }
        return $task
            ->printOutput($exec_options['print_output'])
            ->run()
            ->stopOnFail();
    }

    /**
     * Initialize the Drupal Environment.
     *
     * @command common-admin:init
     *
     * @return void
     */
    public function commonAdminInit(SymfonyStyle $io): void
    {
        // Introduce the common shortcuts so one knows how they work and to
        // configure them.
        $this->introduceCommonShortcuts($io);

        // Create the config sync directory if it does not exist.
        if (!is_dir('config/sync')) {
            $io->note('Creating the config sync directory...');
            $this->taskFilesystemStack()->mkdir(['config/sync'], 0755)->run();
        }

        // Add required composer requirements.
        $io->note('Installing required dependencies...');
        // Don't any modules that need to be enabled. The local environment
        // probably won't be ready at this time, unless this is being re-run
        // after a local is installed. Therefore, you'll have a dependency that
        // might be required but not enabled.
        $this->installDependencies($io, false, ['drupal/core-dev' => 'Provides PHP CS'], true);
        $this->installDependencies($io, false, ['drush/drush' => 'Required for CLI access to Drupal']);

        $io->success('Your project is now ready to install remote (none yet) and local environments');

        $io->success('Configure one or more local environments: ./robo.sh common-admin:local');
        if ($io->confirm('Would you like to install and configure a local environment?')) {
            $this->_exec('./robo.sh common-admin:local');
        }

        //$io->success('Configure a remote environment: ./robo.sh common-admin:remote');


    }

    /**
     * Allows the user to reset their shortcut paths and see help about them.
     *
     * @command common:shortcuts-help
     *
     * @return void
     */
    public function commonShortcutsHelp(SymfonyStyle $io): void
    {
        if ($io->confirm('Would you like to reset your previous selections for PHP & composer paths?', false)) {
            $this->taskFilesystemStack()->remove('.php.env')->run();
            // Reset all common paths.
            // Oddity: You can't set to empty array if an array value is already
            // set. Instead, you have to set it to null.
            $this->saveConfig('flags.common.paths', null, true);
        }
        $this->introduceCommonShortcuts($io, false);
    }

    /**
     * Allows one to install one local environment at a time.
     *
     * @command common-admin:local
     *
     * @return void
     */
    public function commonAdminLocal(SymfonyStyle $io): void
    {
        $locals = [
            'lando' => [
                'name' => 'Lando',
                'installed' => $this->isDependencyInstalled('mattsqd/drupal-env-lando') ? 'Yes, installed' : 'Not installed',
                'description' => 'https://lando.dev/ Push-button development environments hosted on your computer or in the cloud. Automate your developer workflow and share it with your team.',
                'package' => 'mattsqd/drupal-env-lando:dev-main',
                'post_install_commands' => ['./robo.sh drupal-env-lando:scaffold', './robo.sh lando-admin:init'],
            ],
        ];
        $rows = [];
        foreach ($locals as $key => $options) {
            $rows[$key] = [
                $options['name'],
                $options['installed'],
                $options['package'],
                implode(', ', $options['post_install_commands']),
                $options['description'],
            ];
        }
        $io->table(['Name', 'Installed', 'Package', 'Post Install Commands', 'Description'], $rows);
        $not_installed = array_filter($locals, static function (string $key) use ($locals) {
            return $locals[$key]['installed'] === 'Not installed';
        }, ARRAY_FILTER_USE_KEY);
        if (empty($not_installed)) {
            $io->warning('You have installed all local environments.');
            return;
        }
        $options = array_combine(array_keys($not_installed), array_column($not_installed, 'name'));
        $options['cancel'] = 'Cancel';
        $choice = $io->choice('Which environment do you want to install?',  $options, 'cancel');
        if ($choice === 'cancel') {
            $io->caution('Cancelled adding a new local environment.');
            return;
        }
        // Install the Drupal Env Local package.
        if ($this->installDependencies($io, false, [$locals[$choice]['package'] => $locals[$choice]['description']])) {
            if ($io->confirm('Success! Would you like to continue the installation and configuration of the new local environment')) {
                foreach ($locals[$choice]['post_install_commands'] as $post_install_command) {
                    $this->_exec($post_install_command);
                }
            }
            // Scaffold all, in case the order matters for the plugin just
            // installed.
            $this->_exec('./robo.sh drupal-env:scaffold-all');
        } else {
            $io->warning("There was an issue installing {$locals[$choice]['package']}.");
        }
        // @TODO add confirm to scaffold for lando-admin:init.

    }

    /**
     * Allows one to install a remote environment.
     *
     * @command common-admin:remote
     *
     * @return void
     */
    public function commonAdminRemote(SymfonyStyle $io): void
    {
        $io->caution('There are no remotes able to be configured at this time, Platform.sh is coming soon.');
    }

    /**
     * After a local is installed and started, run commands.
     *
     * @command common-admin:post-local-started
     *
     * @return void
     */
    public function commonAdminPostLocalStarted(SymfonyStyle $io): void
    {
        $this->enterToContinue($io, 'Offering to install optional composer dependencies. Can be re-run with `./robo.sh common-admin:optional-dependencies`.');
        $this->_exec('./robo.sh common-admin:optional-dependencies');

        $this->enterToContinue($io, 'Offering to install and enable themes. Can be re-run with `./robo.sh common-admin:theme-set`.');
        $this->_exec('./robo.sh common-admin:theme-set');
    }

    /**
     * Called from each local & remote install.
     *
     * @command common-admin:optional-dependencies
     *
     * @return void
     */
    public function commonAdminInstallOptionalDependencies(SymfonyStyle $io): void
    {
        $flag_name = 'flags.common.installedOptionalDependenciesAlreadyRun';

        $already_run_label = '';
        if ($already_run = $this->getConfig($flag_name, 0)) {
            $already_run_label = " This has already been run for this project, but can be run until their are no modules to enable, if you'd like.";
        }
        if ($io->confirm("Would you like to install some optional but helpful dependencies?$already_run_label", !$already_run)) {
            $optional_deps = [
                'drupal/admin_toolbar' => 'Easy access at the top of the page to admin only links.',
                'drupal/paragraphs' => 'Allows site builders to create dynamic content for every entity.',
                'drupal/disable_user_1_edit' => 'Don\'t let anyone but user 1 edit the super user.',
                'drupal/menu_admin_per_menu' => 'Allows granular per-menu access.',
                'drupal/role_delegation' => 'Allow a role to give only certain roles (don\'t let them make admins)',
                'drupal/twig_tweak' => 'Handy shortcuts and helpers when working in Twig',
                'drupal/twig_field_value' => 'Easily get field values and labels separately in Twig.',
            ];
            $this->installDependencies($io, true, $optional_deps, false);
            $this->installDependencies($io, true, ['drupal/devel' => 'This has many great debugging tools.'], true, true);
        }

        if (!$already_run) {
            $this->saveConfig($flag_name, 1);
        }
    }

    /**
     * Choose your default and/or admin themes.
     *
     * @command common-admin:theme-set
     *
     * @return void
     */
    public function commonAdminThemeSet(SymfonyStyle $io): void {
        $this->isDrupalInstalled($io);
        foreach ([
                     'default' => [
                         'required',
                         "Would you like to set a default theme? Olivero provides some styling while Stark is a blank slate. The default theme will be used for both admin and non-admin pages if no admin theme is set.",
                     ],
                     'admin' => [
                         'not-required',
                         'Would you like to set an admin only theme? Claro is the recommended Admin theme. The admin theme will replace the default theme for admin pages only.',
                     ]] as $theme_type => $values) {
            $output = $this->drush($io, [
                'config-get',
                'system.theme',
                $theme_type
            ], ['print_output' => FALSE])->getOutputData();
            $default_theme = str_replace("'system.theme:$theme_type': ", '', $output);
            $io->note($values[1]);
            $io->info('Options are below for a theme (Use the machine name inside "()"');
            $this->drush($io, [
                'pm-list',
                '--type=theme',
            ])->getOutputData();
            $default_theme_option = '';
            $additional = '';
            if ($values[0] === 'required') {
                $default_theme_option = $default_theme;
            } else {
                $additional = " (Leave blank to not set a $theme_type theme)";
            }
            $theme_choice = $io->ask("Choose a $theme_type theme, current '$default_theme'$additional", $default_theme_option);
            if ($theme_choice === $default_theme || $default_theme === 'null' && $theme_choice === '') {
                $io->note('Leaving as is...');
                continue;
            }
            if (strlen($theme_choice)) {
                // Attempt to make it the machine name if they typed the display
                // name.
                $theme_choice = strtolower(str_replace(' ', '_', $theme_choice));
                // Stable 9 does not follow the normal form.
                if ($theme_choice === 'stable_9') {
                    $theme_choice = 'stable9';
                }
                $this->drush($io, ['theme:enable', $theme_choice]);
            } else {
                // This is supposed to work according to
                // https://github.com/drush-ops/drush/pull/4780 but it does not.
                // Luckily setting a bad value here will not cause the site to
                // break.
                $theme_choice = 'null';
            }
            // Set as the default $theme_type.
            $this->drush($io, ['config-set', 'system.theme', $theme_type, $theme_choice, '-y']);
            if ($theme_type === 'admin' && $theme_choice !== 'null') {
                $node_edit_choice = $io->confirm('Would you like to use the admin theme for node edit pages? Note that if one does not have the permission to view the admin theme, they will see the default theme.');
                $this->drush($io, ['config-set', 'node.settings', 'use_admin_theme', (int) $node_edit_choice, '-y']);
            }
        }
    }

}
