# Bixal.com

## Working with the local

### Starting the Environment

First time:
```
lando start
```

Change something in the .lando.yml config and/or you want to re-install front and back end dependencies?
```
lando rebuild -y
```

Re-install front and back end dependencies
```
lando build
```

### Installing Drupal

```
lando si
```

### Running Drush

```
lando drush <your command>
```

### Running Composer

```
lando composer
```

Or

```
./composer.sh
```

Using it this way allows you to use your local to run the composer command instead of Docker which often times out when using docker. To use your local composer:

 * Install brew https://brew.sh/
 * Install composer `brew install composer`
 * The above will install php 8.3, we want to use 8.1 `brew unlink php@8.3 && brew link php@8.1`
 * Set the local to use your composer: `echo 'BIN_PATH_COMPOSER="composer"' >> .env`

### Composer.log

There is a composer.log that is modified everytime you do something that changes the composer.lock file.
It's important that you always use `lando composer` or `./composer.sh` instead of plain `composer` to run composer commands. Otherwise, an entry in composer.log will not be made.

 * Do not put multiple of the same command in composer.log. If you apply to patches, just leave the last `composer update --patch`

### Access story book

[Storybook](https://storybook.js.org/) for this project can be found by:
 * Docker version: http://storybook.bixalcom.lndo.site/
 * Local version:
   * npm run storybook:local
   * This should automatically open it in your browser.

### Enabling Xdebug

To enable Xdebug, you simply need to run:
```
lando xdebug-on
```

By default, xdebug will not be enabled when lando is built. To make the default enabled, run:

```
vendor/bin/robo xdebug:on-by-default
```

To turn it back off:
```
lando xdebug-off
```

#### Configure Xdebug for PhpStorm

The file `.run/appserver.run.xml` defines the PHP Remote Debug configuration. However, there is a second step. You need to define a 'Server' for it to run on. Simply run:

```
vendor/bin/robo xdebug:phpstorm-debug-config
```
Then in the toolbar choose 'appserver' for your debug configuration.

#### Configure Xdebug for Vscode

Install this plugin https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug.

`.vscode/launch.json` takes care of the configuration.
