<?php

use Robo\ResultData;
use Robo\Tasks;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Finder\Finder;

/**
 * Custom RoboFile commands for this project.
 *
 * @param InputInterface $input
 * @param OutputInterface $output
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
    public function customCommand(InputInterface $input, OutputInterface $output): void
    {
        $io = new SymfonyStyle($input, $output);
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
        InputInterface $input,
        OutputInterface $output,
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
        InputInterface $input,
        OutputInterface $output,
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
    public function validateComponents(InputInterface $input, OutputInterface $output): ResultData
    {
        $io = new SymfonyStyle($input, $output);
        $io->info('Checking if all storybook components are forwarded to Drupal.');
        $forward_file = './stories/_index.scss';
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

}
