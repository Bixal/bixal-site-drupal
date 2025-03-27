# Bixal.com

## Remote

The remote environments are hosted in platform.sh. See the ./.platform directory and .platform.app.yaml file for the configuration.

## Working with the local

The local environment is based on [Drupal Env](https://github.com/mattsqd/drupal-env/wiki) and the [Drupal Env Lando](https://github.com/mattsqd/drupal-env-lando/wiki) packages.

## Branching

Use the following naming for your git branches.

```sh
feature/BSD-[ISSUE_NO]-[LOWER_CASE_DESCRIPTION]
```

**Example**

```sh
feature/BSD-64-robo-validate
```

## Commit style

```sh
BSD fixes #64: Fixed coding standards issues.
```

Also acceptable:

- close, closes, closed
- fix, fixes, fixed
- resolve, resolves, resolved

Example:

```
BSD closes #64: Fixed coding standards issues.
```

More guidance on git branches and commit style in [robo.yml](https://github.com/Bixal/bixal-site-drupal/blob/develop/robo.yml)

### Starting the Environment

#### Prerequisites

- php@8.1
- lando

#### Installing

First time:

```
./robo.sh lando:init
```

For subsequent starts, you can just:

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

This will install all the sample content we have created in `web/modules/custom/bixal_default_content`. In order to export new content here, create it locally and run `lando export-content`.

### Running Drush

```
./drush.sh <your command>
```

### Running Composer

```
./composer.sh
```

Using it this way allows you to use your local to run the composer command instead of Docker which often times out when using docker. To use your local composer:

- Install brew https://brew.sh/
- Install composer `brew install composer`
- The above will install php 8.3, we want to use 8.1 `brew unlink php@8.3 && brew link php@8.1`
- Set the local to use your composer: `echo 'BIN_PATH_COMPOSER="composer"' >> .env`

### Composer.log

There is a composer.log that is modified everytime you do something that changes the composer.lock file.
It's important that you always use `lando composer` or `./composer.sh` instead of plain `composer` to run composer commands. Otherwise, an entry in composer.log will not be made.

- Do not put multiple of the same command in composer.log. If you apply to patches, just leave the last `composer update --patch`

### Access story book

[Storybook preview is available here →](https://www.bixal.com/sb)

[Storybook](https://storybook.js.org/) for this project can be found by:

- Docker version: http://storybook.bixalcom.lndo.site/
- Local version:
  - ./sb.sh
  - This should automatically open it in your browser.

### Handy Commands for Development

- Run all the validation commands that the pipelines run without needing to push remotely `vendor/bin/robo validate:all`.

#### Configure Xdebug

https://github.com/mattsqd/drupal-env-lando/wiki/XDebug-(Personal)
