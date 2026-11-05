<?php

namespace RoboEnv;

use Symfony\Component\Yaml\Yaml;

/**
 * Config split groups: the splits that are active together.
 *
 * Groups and the default group are defined in robo.yml under
 * config_split_groups. settings.php chooses the group for each environment and
 * passes it to enable(). Locally, the current group can be switched with
 * ./robo.sh config:split-group, which is stored in split_group.current.
 */
final class ConfigSplitGroups
{

    /**
     * The robo config file that defines the groups.
     */
    const string CONFIG_FILE = __DIR__ . '/../robo.yml';

    /**
     * The group switched to with config:split-group, ignored by git.
     */
    const string CURRENT_FILE = __DIR__ . '/../split_group.current';

    /**
     * The groups, keyed by group, of split IDs.
     *
     * @return array
     */
    public static function groups(): array
    {
        return self::config()['groups'] ?? [];
    }

    /**
     * The group used locally when none has been switched to.
     *
     * @return string
     */
    public static function default(): string
    {
        return self::config()['default'];
    }

    /**
     * The group switched to with config:split-group, otherwise the default.
     *
     * @return string
     */
    public static function current(): string
    {
        return is_file(self::CURRENT_FILE) ? trim(file_get_contents(self::CURRENT_FILE)) : self::default();
    }

    /**
     * Switch the current group.
     *
     * @param string|null $group
     *    The group, or null to go back to the default.
     *
     * @return void
     */
    public static function setCurrent(?string $group): void
    {
        if ($group === null) {
            if (is_file(self::CURRENT_FILE)) {
                unlink(self::CURRENT_FILE);
            }
            return;
        }
        self::splits($group);
        file_put_contents(self::CURRENT_FILE, $group);
    }

    /**
     * Enable the splits of a group, for use in settings.php.
     *
     * @param array $config
     *    The $config array from settings.php.
     * @param string|null $group
     *    The group, or null to enable no splits.
     *
     * @return void
     */
    public static function enable(array &$config, ?string $group): void
    {
        if ($group === null) {
            return;
        }
        foreach (self::splits($group) as $split) {
            $config["config_split.config_split.$split"]['status'] = TRUE;
        }
    }

    /**
     * The split IDs of a group.
     *
     * @param string $group
     *
     * @return array
     *
     * @throws \InvalidArgumentException
     *    When the group is not defined.
     */
    public static function splits(string $group): array
    {
        $groups = self::groups();
        if (!isset($groups[$group])) {
            throw new \InvalidArgumentException("Unknown config split group '$group'. Options: " . implode(', ', array_keys($groups)));
        }
        return $groups[$group];
    }

    /**
     * The config_split_groups section of robo.yml.
     *
     * @return array
     *
     * @throws \UnexpectedValueException
     *    When the section, its default or the default's group is missing.
     */
    private static function config(): array
    {
        static $config;
        if (!isset($config)) {
            $config = Yaml::parseFile(self::CONFIG_FILE)['config_split_groups'] ?? null;
            if (!is_array($config) || !isset($config['default'], $config['groups'][$config['default']])) {
                throw new \UnexpectedValueException('robo.yml must define config_split_groups with a default group and its splits under groups.');
            }
        }
        return $config;
    }

}
