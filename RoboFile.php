<?php

use RoboEnv\ConfigSplitGroups;
use Robo\ResultData;
use Robo\Tasks;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Finder\Finder;

/**
 * Custom RoboFile commands for this project.
 *
 * @class RoboFile
 */
class RoboFile extends Tasks
{
    /**
     * Placeholder for your own project's commands.
     *
     * @command drupal-project:custom-command
     *
     * @return void
     *
     * @throws \Exception
     */
    public function customCommand(SymfonyStyle $io): void
    {
        $io->comment('This is just a placeholder command, please add your own custom commands here. Please edit : ' . __FILE__);
    }

    /**
     * Shared functionality to help create and re-tag a release.
     *
     * @param string $hotfix_or_release
     *    Either 'hotfix' or 'release'.
     * @param string $semantic_version
     *    A semantic version number in the form x.y.z. Release must end in 0.
     *
     * @return array
     *    An indexed array of [$tag_description, $new_branch_name, $source_branch].
     *
     * @throws \Exception
     */

    protected function getVariablesForRelease(string $hotfix_or_release, string $semantic_version): array
    {
        if (!in_array($hotfix_or_release, ['hotfix', 'release'])) {
            throw new InvalidArgumentException("hotfix_or_release must be either 'hotfix' or 'release', '$hotfix_or_release' given.");
        }

        // @see https://regex101.com/r/Ly7O1x/3/.
        if ($hotfix_or_release === 'hotfix') {
            if (!preg_match('/^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>[1-9]\d*)$/', $semantic_version)) {
                throw new InvalidArgumentException("semantic_version must be in the form x.y.z, where z is greater than 0, '$semantic_version' given.");
            }
        } else if (!preg_match('/^(?P<major>0|[1-9]\d*)\.(?P<minor>0|[1-9]\d*)\.(?P<patch>0)$/', $semantic_version)) {
            throw new InvalidArgumentException("semantic_version must be in the form x.y.z, where z is 0, '$semantic_version' given.");
        }
        $this->_exec('git status');
        if (`git status --porcelain`) {
            throw new \Exception('Your "git status" must be clean of any changes or untracked files before continuing. Please see the output of "git status" above.');
        }
        if ($hotfix_or_release === 'hotfix') {
            $source_branch = 'main';
            $tag_description = "Hotfix version $semantic_version";
        } else {
            $source_branch = 'develop';
            $tag_description = "Release version $semantic_version";
        }

        $new_branch_name = "$hotfix_or_release/$semantic_version";

        return [$tag_description, $new_branch_name, $source_branch];
    }

    /**
     * Create a release.
     *
     * @command drupal-project:create-release
     *
     * @aliases create-release
     *
     * @param string $hotfix_or_release
     *   Either 'hotfix' or 'release'.
     * @param string $semantic_version
     *   A semantic version number in the form x.y.z. Release must end in 0.
     *
     * @return \Robo\ResultData
     *
     * @throws \Exception
     */
    public function createRelease(
        string $hotfix_or_release,
        string $semantic_version,
    ): ResultData
    {
        [$tag_description, $new_branch_name, $source_branch] = $this->getVariablesForRelease($hotfix_or_release, $semantic_version);

        `git fetch`;
        // Checkout the branch that the release will be created from.
        $this->taskGitStack()
            ->stopOnFail()
            ->checkout($source_branch)
            ->run();

        // If you trying to test this function, you will need to temp change
        // $source_branch to whatever branch you are working in, otherwise,
        // your changes will get wiped out.
        // You will also want to comment the following line out, since it will
        // also wipe out your changes.
        `git reset --hard origin/$source_branch`;

        // Create the new release branch.
        `git checkout -b $new_branch_name`;

        // Create a new release tag and push the release branch and tag.
        $this->taskGitStack()
            ->stopOnFail()
            ->push('origin', $new_branch_name)
            ->tag("v$semantic_version", $tag_description)
            ->push('origin', "v$semantic_version")
            ->run();

        return new ResultData();
    }

    /**
     * Re-creates the tag for a release after updates have been pushed.
     *
     * The release branch will already be up to date because a feature branch
     * should have been pushed to it, but the initial tag will be out of date
     * now. This checks out the current version of the release, deletes the tag
     * then pushes back up the tag.
     *
     * @command drupal-project:re-tag-release
     *
     * @aliases re-tag
     *
     * @param string $hotfix_or_release
     *   Either 'hotfix' or 'release'.
     * @param string $semantic_version
     *   A semantic version number in the form x.y.z. Release must end in 0.
     *
     * @return \Robo\ResultData
     *
     * @throws \Exception
     */
    public function reTagRelease(
        string $hotfix_or_release,
        string $semantic_version,
    ): ResultData
    {
        [$tag_description, $new_branch_name] = $this->getVariablesForRelease($hotfix_or_release, $semantic_version);

        `git fetch`;
        // Check back out the release branch that has been updated by a feature
        // request and is ahead of the source branch.
        $this->taskGitStack()
            ->stopOnFail()
            ->checkout($new_branch_name)
            ->run();

        // Ensure that the release is at the latest.
        `git reset --hard origin/$new_branch_name`;

        // Delete the old tag locally and remotely.
        `git tag --delete v$semantic_version`;
        `git push origin --delete v$semantic_version`;

        // Create a new tag of the same named based on the updated release
        // branch.
        $this->taskGitStack()
            ->stopOnFail()
            ->tag("v$semantic_version", $tag_description)
            ->push('origin', "v$semantic_version")
            ->run();

        return new ResultData();
    }

    /**
     * Ensure that all components are forwarded to Drupal.
     *
     * @command bixalcom:validate-components
     *
     * @aliases validate-components
     *
     * @return void
     *
     * @throws \Exception
     */
    public function validateComponents(SymfonyStyle $io): ResultData
    {
        $io->info('Checking if all storybook components are forwarded to Drupal.');
        $forward_file = './stories/_design-system.scss';
        $forwards = file_get_contents($forward_file);
        $finder =  Finder::create();
        $missing_components = [];
        foreach ($finder->in('stories/components')->name('*.scss')->files() as $file) {
            $component = explode('/', $file->getPath(), 2)[1];
            if (!str_contains($forwards, sprintf('@forward "%s/', $component))) {
                $missing_components[] = $component;
            }
        }
        if (!empty($missing_components)) {
            throw new \Exception(sprintf('The following components created in storybook are not found in "%s": %s', $forward_file, implode(', ', $missing_components)));
        }
        $io->success('All storybook components are forwarded to Drupal.');
        return new ResultData();
    }

    /**
     * Utility: Export all content.
     *
     * @command drupal-project:export-content
     *
     * @aliases export-content
     *
     * @return \Robo\ResultData
     *
     * @throws \Exception
     */
    public function exportContent(
        SymfonyStyle $io,
        array $opts = [
            'path' => 'modules/custom/bixal_default_content',
            'entities' => [
                'node',
                'menu_link_content',
                'media',
            ],
        ]
    ): ResultData
    {
        $path =  $opts['path'];
        $entities = $opts['entities'];
        if (is_dir("web/$path/content")) {
            $io->info('Removing existing default content exported.');
            $this->_cleanDir("web/$path/content");
        }
        foreach ($entities as $entity) {
            $io->info("Exporting $entity as default content");
            $this->_exec("./drush.sh default-content:export-references $entity --folder=$path/content");
        }
        $io->info("Finished exporting default content to $path/content");

        return new ResultData();
    }

    /**
     * Switch the local config split group, then update the site.
     *
     * Groups and the default group are defined in robo.yml.
     *
     * @command config:split-group
     *
     * @param string|null $group
     *    The group to switch to. Omit to list groups and show the current one.
     *
     * @option reset Go back to the default group.
     * @option no-update Only switch the group, do not run common:site-update.
     *   Use when running the drush commands yourself, such as config:import or
     *   updatedb.
     *
     * @return void
     */
    public function splitGroup(
        SymfonyStyle $io,
        ?string $group = null,
        array $opts = ['reset' => false, 'no-update' => false]
    ): void
    {
        if ($opts['reset']) {
            ConfigSplitGroups::setCurrent(null);
            $io->info("Switched back to the default '" . ConfigSplitGroups::default() . "' split group.");
        } elseif ($group === null) {
            $groups = ConfigSplitGroups::groups();
            $io->listing(array_map(fn($name) => "$name: " . implode(', ', $groups[$name]), array_keys($groups)));
            $io->comment('Default: ' . ConfigSplitGroups::default() . ', current: ' . ConfigSplitGroups::current());
            return;
        } else {
            ConfigSplitGroups::setCurrent($group);
            $io->info("Switched to the '$group' split group.");
        }

        if (!$opts['no-update']) {
            $this->_exec('./robo.sh common:site-update');
            $this->warnConfigInSync($io, "Config still differs after importing the '" . ConfigSplitGroups::current() . "' split group, so it will not import cleanly on its environments either");
        }
    }

    /**
     * Capture config changes from update hooks for every split group.
     *
     * On the current code, each split group is imported and its database is
     * backed up. Then composer is run, and for each group its database is
     * restored, updatedb is run and config is exported. Fails if a group
     * changes config that an earlier group already exported differently.
     *
     * Start from an installed site on the old code with no config changes.
     * Exported config is left staged in git for review.
     *
     * With --stop, it stops after the backups so code can be updated by hand,
     * and --continue runs the rest. The backups and what --continue needs are
     * kept in .config-update-capture until it finishes or --abort is run.
     *
     * @command config:update-capture
     *
     * @option composer The composer update or require command to run between the
     *   two phases.
     * @option ask Choose the commands to run between the two phases, one at a
     *   time, instead of running --composer.
     * @option stop Stop after the backups, to update code yourself.
     * @option continue Run update hooks and export config after --stop.
     * @option abort Delete the backups from --stop without continuing.
     *
     * @usage config:update-capture
     *   Update every package within its version constraint.
     * @usage config:update-capture --ask
     *   Choose what to run, such as checking outdated packages or security
     *   advisories first.
     * @usage config:update-capture --composer='composer update "drupal/core-*" --with-all-dependencies'
     *   Update Drupal core only.
     * @usage config:update-capture --composer='composer update drupal/webform --with-all-dependencies'
     *   Update one module and its dependencies.
     * @usage config:update-capture --composer='composer require drupal/webform:^7 --with-all-dependencies'
     *   Change a module's version constraint, such as a new major version.
     * @usage config:update-capture --stop
     *   Back up, then stop so you can update code yourself.
     * @usage config:update-capture --continue
     *   After --stop and updating code, capture the config changes.
     * @usage config:update-capture --abort
     *   Give up on a capture started with --stop.
     *
     * @return void
     *
     * @throws \Exception
     */
    public function configUpdateCapture(
        SymfonyStyle $io,
        array $opts = ['composer' => 'composer update', 'ask' => false, 'stop' => false, 'continue' => false, 'abort' => false]
    ): void
    {
        if (count(array_filter([$opts['ask'], $opts['stop'], $opts['continue'], $opts['abort']])) > 1) {
            throw new \InvalidArgumentException('Use only one of --ask, --stop, --continue and --abort.');
        }
        $state = $this->captureState();

        if ($opts['abort'] || $opts['continue']) {
            if ($state === null) {
                throw new \Exception('No capture is stopped, start one with --stop.');
            }
            if ($opts['abort']) {
                try {
                    $this->captureRestoreStart($io, $state);
                } finally {
                    $this->captureCleanup($io, $state);
                }
                $io->success("The database is back to how it was before --stop, and the backups were deleted.\n"
                    . 'If code was updated since, revert it or run ./robo.sh common:site-update.');
                return;
            }
            $pathspec = $this->pathspec($state['config_dirs']);
            if ($this->execOrFail("git status --porcelain -- $pathspec", false) !== '') {
                throw new \Exception('Config changed since --stop. Undo the changes in ' . implode(', ', $state['config_dirs']) . ' and run --continue again, or run --abort.');
            }
            try {
                $this->captureUpdateHooks($io, $state);
            } catch (\Throwable $e) {
                $this->captureRestoreAfterFailure($io, $state, "The database is back to how it was before --stop and the backups are kept. To try again, fix the problem, discard the partial export with:\n"
                    . "git restore --staged --worktree -- $pathspec && git clean -fd -- $pathspec\n"
                    . 'then run --continue again. Otherwise run --abort.');
                throw $e;
            }
            $this->captureCleanup($io, $state);
            $this->captureFinish($io);
            return;
        }

        if ($state !== null) {
            throw new \Exception('A capture is stopped, finish it with --continue or delete it with --abort.');
        }
        // Checked first, so a bad value fails before the slow backups.
        $composer = $opts['ask'] || $opts['stop'] ? null : $this->composerCommand($opts['composer']);
        $state = $this->captureBackups($io);

        if ($opts['stop']) {
            // So the site works as before while code is updated by hand.
            try {
                $this->captureRestoreStart($io, $state);
            } catch (\Throwable $e) {
                $this->captureCleanup($io, $state);
                throw $e;
            }
            file_put_contents(self::CAPTURE_STATE_FILE, json_encode($state, JSON_PRETTY_PRINT));
            $io->success("Backups are taken. Update code yourself, for example with composer require or composer update, then run:\n"
                . "./robo.sh config:update-capture --continue\n"
                . 'To give up instead: ./robo.sh config:update-capture --abort');
            return;
        }

        try {
            $io->section('Update code');
            if ($opts['ask']) {
                $this->askUpdateCommands($io);
            } else {
                $this->execOrFail($composer);
            }
            $this->captureUpdateHooks($io, $state);
        } catch (\Throwable $e) {
            $this->captureRestoreAfterFailure($io, $state, 'The database is back to how it was before the capture. Code changes are kept, revert them or run ./robo.sh common:site-update.');
            throw $e;
        } finally {
            $this->captureCleanup($io, $state);
        }
        $this->captureFinish($io);
    }

    /**
     * Where config:update-capture keeps its backups and state.
     */
    const string CAPTURE_DIR = '.config-update-capture';

    /**
     * What config:update-capture --continue needs from --stop.
     */
    const string CAPTURE_STATE_FILE = self::CAPTURE_DIR . '/state.json';

    /**
     * Check the site can be captured, then back up each split group.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     *
     * @return array
     *    The groups, their backup IDs and the config directories.
     *
     * @throws \Exception
     */
    protected function captureBackups(SymfonyStyle $io): array
    {
        // Drush may exit non-zero when it cannot bootstrap, so only the output
        // is checked.
        $bootstrap = $this->taskExec('./drush.sh status --field=bootstrap 2>/dev/null')->printOutput(false)->run();
        if (trim($bootstrap->getMessage()) !== 'Successful') {
            throw new \Exception('Drupal is not installed, install the site on the current code before capturing updates.');
        }
        $io->info("Drupal is installed");
        // Otherwise updb on the new code would also run these, and their
        // config changes would be captured as if the new code made them.
        $pending = json_decode($this->execOrFail('./drush.sh updatedb:status --format=json 2>/dev/null', false) ?: '[]', true);
        if ($pending) {
            $names = array_map(fn($update) => "{$update['module']}: {$update['update_id']}", $pending);
            throw new \Exception("Database updates are pending on the current code, run ./drush.sh updb, export and commit any config changes before capturing updates:\n" . implode("\n", $names));
        }
        $io->info("No database updates are pending.");
        // Importing each group would otherwise overwrite unexported changes.
        $this->assertConfigInSync('Config differs from the sync directory, export or import it before capturing updates');
        $io->info("Config is clean / in sync.");
        // Kept, since drush may not bootstrap on the new code before updb.
        $config_dirs = $this->configDirs();
        if ($this->execOrFail('git status --porcelain -- ' . $this->pathspec($config_dirs)) !== '') {
            throw new \Exception('Commit or stash changes in ' . implode(', ', $config_dirs) . ' before capturing updates.');
        }
        $io->info("No un-committed config changes are present.");

        $start = ConfigSplitGroups::current();
        $state = [
            // First, so its backup can put the site back how it started.
            'groups' => array_values(array_unique([$start, ...array_keys(ConfigSplitGroups::groups())])),
            'start_group' => $start,
            'ids' => [],
            'backed_up' => [],
            'config_dirs' => $config_dirs,
        ];
        foreach ($state['groups'] as $group) {
            $state['ids'][$group] = "config-update-capture-$group-" . date('YmdHis');
        }
        if (!is_dir(self::CAPTURE_DIR)) {
            mkdir(self::CAPTURE_DIR);
        }
        try {
            // Persist cache in the database until cleanup, so each backup holds
            // its own cache. Redis, memcache and APCu are not restored with a
            // backup and would keep another database's cache, and drush cr
            // after each restore can fail on new code before updb has run.
            $this->captureDatabaseCache($io, true);
            foreach ($state['groups'] as $group) {
                $io->section("Back up the '$group' split group on the current code");
                ConfigSplitGroups::setCurrent($group);
                // Import twice like a deploy does, since modules enabled by a
                // split can change config imported along with them.
                $this->execOrFail('./drush.sh cim -y');
                $this->execOrFail('./drush.sh cim -y');
                // Otherwise the difference would be exported in the second
                // phase as if an update hook made it.
                $this->assertConfigInSync("The '$group' split group's config does not import cleanly, fix it before capturing updates");
                $this->execOrFail($this->dbCommand('backup', $state['ids'][$group], self::CAPTURE_DIR));
                $state['backed_up'][] = $group;
            }
        } catch (\Throwable $e) {
            $this->captureRestoreAfterFailure($io, $state, 'The database is back to how it was before the capture.');
            $this->captureCleanup($io, $state);
            throw $e;
        }
        return $state;
    }

    /**
     * Restore each split group's backup, run updb and export its config.
     *
     * Fails if a group changes config that an earlier group already exported
     * differently.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     * @param array $state
     *    From captureBackups().
     *
     * @return void
     *
     * @throws \Exception
     */
    protected function captureUpdateHooks(SymfonyStyle $io, array $state): void
    {
        $pathspec = $this->pathspec($state['config_dirs']);
        foreach ($state['groups'] as $group) {
            $io->section("Run update hooks for the '$group' split group");
            ConfigSplitGroups::setCurrent($group);
            $this->execOrFail($this->dbCommand('restore', $state['ids'][$group], self::CAPTURE_DIR));
            $this->execOrFail('./drush.sh updb -y');
            $this->execOrFail('./drush.sh cex -y');
            $this->assertConfigInSync("The '$group' split group's exported config does not match its database, check how its splits are configured");
            // Earlier groups are staged, so unstaged changes to tracked files
            // are ones this group exported differently.
            $conflicts = $group === $state['groups'][0] ? '' : $this->execOrFail("git diff --name-only -- $pathspec", false);
            if ($conflicts !== '') {
                throw new \Exception("The '$group' split group changed config that an earlier group already exported:\n$conflicts");
            }
            // git add fails on a pathspec that matches nothing, such as a
            // split folder with no config.
            $existing = array_filter($state['config_dirs'], 'is_dir');
            if ($existing) {
                $this->execOrFail('git add -A -- ' . $this->pathspec($existing));
            }
        }
    }

    /**
     * Update the site on the split group it started on, after captureCleanup().
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     *
     * @return void
     *
     * @throws \Exception
     */
    protected function captureFinish(SymfonyStyle $io): void
    {
        $io->section("Update the site on the '" . ConfigSplitGroups::current() . "' split group it started on");
        $this->execOrFail('./robo.sh common:site-update');
        $io->success('Config changes from update hooks are staged in git, review them with: git diff --cached');
    }

    /**
     * Restore the backup of the split group the site started on.
     *
     * Config was in sync when the capture started, so this backup is the
     * site as it started. Without it, the backups failed on the first group's
     * import, which changed nothing since config was in sync.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     * @param array $state
     *    From captureBackups().
     *
     * @return void
     *
     * @throws \Exception
     */
    protected function captureRestoreStart(SymfonyStyle $io, array $state): void
    {
        $start = $state['start_group'];
        $io->section("Return the site to the '$start' split group it started on");
        $this->captureSetStartGroup($io, $state);
        if (in_array($start, $state['backed_up'], true)) {
            $this->execOrFail($this->dbCommand('restore', $state['ids'][$start], self::CAPTURE_DIR));
        }
    }

    /**
     * Restore the starting split group after a failure, without hiding it.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     * @param array $state
     *    From captureBackups().
     * @param string $note
     *    Shown once the database is restored.
     *
     * @return void
     */
    protected function captureRestoreAfterFailure(SymfonyStyle $io, array $state, string $note): void
    {
        try {
            $this->captureRestoreStart($io, $state);
            $io->note($note);
        } catch (\Throwable $restore_error) {
            // The original failure is thrown by the caller.
            $io->error("Could not put the database back how it started: {$restore_error->getMessage()}");
        }
    }

    /**
     * Switch back to the split group the site started on.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     * @param array $state
     *    From captureBackups().
     *
     * @return void
     */
    protected function captureSetStartGroup(SymfonyStyle $io, array $state): void
    {
        $start = $state['start_group'];
        // Only said once, when it changes.
        if (ConfigSplitGroups::current() !== $start) {
            $io->info("Switched back to the '$start' split group it started on.");
        }
        // Without a split_group.current file when it started on the default.
        ConfigSplitGroups::setCurrent($start === ConfigSplitGroups::default() ? null : $start);
    }

    /**
     * Delete the backups and state, go back to the starting split group and
     * the site's own cache backend.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     * @param array $state
     *    From captureBackups().
     *
     * @return void
     */
    protected function captureCleanup(SymfonyStyle $io, array $state): void
    {
        $this->captureSetStartGroup($io, $state);
        foreach ($state['backed_up'] as $group) {
            $this->_exec($this->dbCommand('delete', $state['ids'][$group], self::CAPTURE_DIR));
        }
        if (is_dir(self::CAPTURE_DIR)) {
            $this->_deleteDir(self::CAPTURE_DIR);
        }
        $this->captureDatabaseCache($io, false);
    }

    /**
     * Start and end of what captureDatabaseCache() appends.
     *
     * The same as DrupalEnvCommandsBase::append() would use.
     */
    const array CAPTURE_SETTINGS_MARKERS = [
        "\n// Appended to by config:update-capture.\n\n",
        "\n// End of appended content by config:update-capture.\n",
    ];

    /**
     * Cache in the database during a capture, or go back to the site's own.
     *
     * Database backups otherwise do not restore the cache when it is kept in
     * Redis or memcache, leaving the site with the cache of another database.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     * @param bool $enable
     *    True to cache in the database, false to remove that again.
     *
     * @return void
     *
     * @throws \Exception
     *    When enabling, if settings.local.php is not loaded or the cache is
     *    still not in the database.
     */
    protected function captureDatabaseCache(SymfonyStyle $io, bool $enable): void
    {
        // The web root as DrupalEnvCommandsBase::append() finds it.
        $composer_json = json_decode(file_get_contents('composer.json'), true);
        $web_root = trim($composer_json['extra']['drupal-scaffold']['locations']['web-root'] ?? 'web', '/');
        $file = "$web_root/sites/default/settings.local.php";
        // settings.drupal_env.php creates and loads it only on local
        // environments, so it exists once drush has bootstrapped.
        if (!is_file($file)) {
            if ($enable) {
                throw new \Exception("$file is needed to cache in the database during the capture, it is only loaded on local environments.");
            }
            return;
        }
        [$start, $end] = self::CAPTURE_SETTINGS_MARKERS;
        $original = file_get_contents($file);
        // Removed first, so it is never appended twice.
        $contents = preg_replace('/' . preg_quote($start, '/') . '.*?' . preg_quote($end, '/') . '/s', '', $original);
        if ($enable) {
            $snippet = preg_replace('/^<\?php\s*/', '', file_get_contents('RoboEnv/scripts/settings.cache-database.php'));
            $contents .= $start . $snippet . $end;
        } elseif ($contents === $original) {
            return;
        }
        $io->section($enable ? 'Cache in the database during the capture' : "Go back to the site's own cache backend");
        file_put_contents($file, $contents);

        // Clear what the backend now in use has from before. drush cr builds
        // the container from code, so a stale cached one does not matter.
        if (!$this->taskExec('./drush.sh cr')->run()->wasSuccessful()) {
            if ($enable) {
                throw new \Exception('Could not clear the cache after switching to the database cache.');
            }
            // Likely new code on a database that has not been updated yet.
            $io->warning('Could not clear the cache. Revert the code or run ./drush.sh updb, then ./drush.sh cr.');
            return;
        }
        if ($enable) {
            // Check that nothing loaded after the appended settings changed
            // the cache again.
            $backend = $this->execOrFail('./drush.sh php:script RoboEnv/scripts/cache-backend.php 2>/dev/null', false);
            if ($backend !== 'cache.backend.database') {
                throw new \Exception("The cache is still in '$backend', check that nothing after the appended settings in $file changes the cache.");
            }
        }
    }

    /**
     * The state saved by config:update-capture --stop.
     *
     * @return array|null
     *    Null when no capture is stopped.
     */
    protected function captureState(): ?array
    {
        return is_file(self::CAPTURE_STATE_FILE) ? json_decode(file_get_contents(self::CAPTURE_STATE_FILE), true) : null;
    }

    /**
     * Quote paths for a git pathspec.
     *
     * @param string[] $paths
     *
     * @return string
     */
    protected function pathspec(array $paths): string
    {
        return implode(' ', array_map('escapeshellarg', $paths));
    }

    /**
     * Ask for commands that update code and run them, one at a time.
     *
     * A failed command is reported and the choice is offered again, so a typo
     * does not throw away the backups taken so far.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     *
     * @return void
     */
    protected function askUpdateCommands(SymfonyStyle $io): void
    {
        $presets = [
            'a' => './composer.sh update',
            'b' => './composer.sh update "drupal/core-*" --with-all-dependencies',
        ];
        // Only show information, so the choice is offered again afterwards.
        $reports = [
            'c' => './composer.sh outdated',
            'd' => './composer.sh audit',
        ];
        while (true) {
            $choice = $io->choice('How should code be updated?', [
                'a' => "Everything: {$presets['a']}",
                'b' => "Core: {$presets['b']}",
                'c' => "See packages with updates: {$reports['c']}",
                'd' => "See packages with security advisories: {$reports['d']}",
                'e' => 'Your own command, run from the project root',
            ], 'a');
            if (isset($reports[$choice])) {
                // Both exit non-zero when they find something, so the exit
                // code is not a failure.
                $this->taskExec($reports[$choice])->run();
                continue;
            }
            $failed = false;
            try {
                $command = $this->composerCommand($presets[$choice] ?? (string) $io->ask('Command, starting with composer update or composer require (or ./composer.sh)'));
                if (!$this->taskExec($command)->run()->wasSuccessful()) {
                    $io->error("Command failed: $command");
                    $failed = true;
                }
            } catch (\InvalidArgumentException $e) {
                $io->error($e->getMessage());
                $failed = true;
            }
            // Default to another go when this one did not do anything.
            if (!$io->confirm('Run another command?', $failed)) {
                break;
            }
        }
    }

    /**
     * Validate a composer update or require command.
     *
     * @param string $command
     *    Starting with composer or ./composer.sh, then update or require.
     *
     * @return string
     *    The command, starting with ./composer.sh.
     *
     * @throws \InvalidArgumentException
     *    When it is not a single composer update or require command.
     */
    protected function composerCommand(string $command): string
    {
        // Composer must run in the environment, so `composer` becomes
        // ./composer.sh. require is allowed to change version constraints.
        $command = preg_replace('/^(?:\.\/composer\.sh|composer)\s+(update|require)(?=\s|$)/', './composer.sh $1', trim($command), 1, $count);
        if ($count === 0) {
            throw new \InvalidArgumentException('The command must start with composer update or composer require (or ./composer.sh).');
        }
        // Only the one composer command may run.
        if (strpbrk($command, '&|;') !== false) {
            throw new \InvalidArgumentException('The command must not contain &, | or ;.');
        }
        return $command;
    }

    /**
     * The config sync directory and every config split's folder.
     *
     * Read from the site, since the sync directory is set in settings.php and
     * split folders in each split's config.
     *
     * @return string[]
     *    Paths relative to the project root.
     *
     * @throws \Exception
     *
     * @see RoboEnv/scripts/config-dirs.php
     */
    protected function configDirs(): array
    {
        // Only the paths are printed to stdout, notices go to stderr.
        $dirs = $this->execOrFail('./drush.sh php:script RoboEnv/scripts/config-dirs.php 2>/dev/null', false);
        if ($dirs === '') {
            throw new \Exception('Could not determine the config directories from the site.');
        }
        return array_values(array_unique(explode("\n", $dirs)));
    }

    /**
     * Config that differs between the database and the sync directory.
     *
     * @return string
     *    One config name per line, empty when in sync.
     *
     * @throws \Exception
     */
    protected function configDiff(): string
    {
        // Only the names are printed to stdout, notices go to stderr.
        return $this->execOrFail('./drush.sh config:status --format=list 2>/dev/null', false);
    }

    /**
     * Throw an exception if config differs from the sync directory.
     *
     * @param string $message
     *    Shown before the config that differs.
     *
     * @return void
     *
     * @throws \Exception
     */
    protected function assertConfigInSync(string $message): void
    {
        $diff = $this->configDiff();
        if ($diff !== '') {
            throw new \Exception("$message:\n$diff");
        }
    }

    /**
     * Show a warning if config differs from the sync directory.
     *
     * @param \Symfony\Component\Console\Style\SymfonyStyle $io
     * @param string $message
     *    Shown before the config that differs.
     *
     * @return void
     *
     * @throws \Exception
     */
    protected function warnConfigInSync(SymfonyStyle $io, string $message): void
    {
        $diff = $this->configDiff();
        if ($diff !== '') {
            $io->warning("$message:\n$diff");
        }
    }

    /**
     * Build a db:* command, see RoboEnv\Robo\Plugin\Commands\DbCommands.
     *
     * @param string $action
     *    backup, restore or delete.
     * @param string $id
     * @param string $dir
     *
     * @return string
     */
    protected function dbCommand(string $action, string $id, string $dir): string
    {
        return "./robo.sh db:$action " . escapeshellarg($id) . ' --dir=' . escapeshellarg($dir);
    }

    /**
     * Run a command, throwing an exception if it fails.
     *
     * @param string $command
     * @param bool $print_output
     *
     * @return string
     *    The command's output, trimmed.
     *
     * @throws \Exception
     */
    protected function execOrFail(string $command, bool $print_output = true): string
    {
        $result = $this->taskExec($command)->printOutput($print_output)->run();
        if (!$result->wasSuccessful()) {
            throw new \Exception("Command failed: $command");
        }
        return trim($result->getMessage());
    }

}
