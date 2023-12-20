<?php

use Robo\Tasks;
use Symfony\Component\Yaml\Yaml;

/**
 * Run orchestration tasks.
 *
 * This file expects to be called from the root of a Drupal site.
 *
 * @class RoboFile
 */
class RoboFile extends Tasks {

    /**
     * Add the server required to make Xdebug work in PhpStorm.
     *
     * This works with /.run/appserver.run.xml to allow Xdebug to work.
     *
     * @command xdebug:phpstorm-debug-config
     */
    public function xdebugPhpstormDebugConfig()
    {
        if (!class_exists('DOMDocument')) {
          throw new \Exception('Your local PHP must have the "dom" extension installed.');
        }
        $xml = new DOMDocument('1.0','UTF-8');
        $xml->preserveWhiteSpace = TRUE;

        if (!@$xml->load(".idea/php.xml")) {
          throw new \Exception('Are you sure your using PhpStorm? There is no /.idea/php.xml file.');
        }
        $components = $xml->getElementsByTagName("component");
        /** @var DOMElement $row */
        foreach($components as $row) {
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
   * Create a v4 UUID.
   *
   * @param string|null $data
   *   Optional random data.
   *
   * @return string
   *   A v4 UUID.
   */
    protected function genUuidV4($data = null) :string {
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
   * When Lando starts up, xdebug will now be on by default.
   *
   * @command xdebug:on-by-default
   */
    public function xdebugOnByDefault() {
      $file_path = '.lando.local.yml';
      $this->taskFilesystemStack()->touch($file_path)->run();
      $yml_file = Yaml::parse(file_get_contents($file_path));
      $yml_value =& $yml_file['config']['xdebug'];
      if (($yml_file['config']['xdebug'] ?? false) === true) {
        $this->yell('Xdebug is enabled by default, disabling now.');
        $yml_value = false;
        $this->_exec('lando xdebug-off');
      }
      else {
        $this->yell('Enabling Xdebug by default.');
        $yml_value = true;
        $this->_exec('lando xdebug-on');
      }
      file_put_contents($file_path,  Yaml::dump($yml_file, 5));
    }

}
