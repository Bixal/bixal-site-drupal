# Bixal.com - Drupal site

## Remote Environments

> [!NOTE]
> We have environments for: dev, stage, and prod. They are manually created and require access to Platform.sh.

The remote environments are hosted in platform.sh. See the `./.platform` directory and `.platform.app.yaml` file for the configuration.

**Website & Storybook**

Links to environments can be found in [SharePoint 🔒](https://bixal365.sharepoint.com/:x:/s/Dev/ETDXL_cyD11Ahbtub5L-658BuyLzJ9Hky_LmvkkAcDsEZQ?e=wIKXpt).

> [!CAUTION] > **HIT REFRESH AFTER CLICKING.** Story book will not load because the basic auth credentials are in the URL.

## Getting Started

### Prerequisites

- php@8.3
- [Lando](https://lando.dev/) or [DDEV](https://ddev.com/)
- node LTS

### Working with Local Environment

The local environment is based on [Drupal Env](https://github.com/mattsqd/drupal-env/wiki), [Drupal Env Lando](https://github.com/mattsqd/drupal-env-lando/wiki), and [Drupal Env DDEV](https://github.com/mattsqd/drupal-env-ddev) packages.

#### First Time Setup

DDEV:

```
ddev start
./robo.sh ddev:init
```

Lando:

```
lando start
./robo.sh lando:init
```

#### Switching between DDEV and Lando

```
ddev poweroff
./robo.sh lando:init
```

```
lando poweroff
./robo.sh ddev:init
```

#### Starting/Stopping the Environment

**Starting**

For future sessions, you can start:

```
ddev start
```

```
lando start
```

**Stopping**

Run the following command to stop the environment:

```
ddev stop
```

```
lando stop
```

You'll be able to visit the local site at: https://bixalcom.ddev.site or https://bixalcom.lndo.site.

#### Rebuilding / Reinstalling Dependencies

Change something in the `.lando.yml` config and/or you want to re-install front and back end dependencies?

**Start Fresh**

```
ddev start && robo si
```

```
lando rebuild -y && robo si
```

**Re-install front end dependencies ONLY**

```
ddev exec './orch/build_node.sh;'
```

```
lando build_node
```

**Update dependencies**

Updates with dependencies included.

```bash
./composer.sh update -W
```

## Testing Guidelines

### Accessibility Testing

Accessibility is a core requirement to our work. Our baseline is:

- [`WCAG 2.1 AA`](https://www.w3.org/TR/WCAG21/)
- [`Section 508`](https://www.section508.gov/manage/laws-and-policies/)

Additionally we follow Deque's [Best Practice rules](https://dequeuniversity.com/rules/axe/4.4/#best-practices-rules). These rules are defined in our Storybook's `preview.js`.

You should still test manually to ensure a fully accessible experience. See Bixal's [A11Y Checklist](https://library.bixal.com/books/frontend-practice/page/frontend-accessibility-checklist) for full testing instructions.

## Git Workflow

### Branch Naming Convention

Use the following naming for your git branches:

```sh
feature/BSD-[ISSUE_NO]-[LOWER_CASE_DESCRIPTION]
```

**Example**

```sh
feature/BSD-64-robo-validate
```

### Commit style

```sh
BSD fixes #64: Fixed coding standards issues.
```

The following keywords are also acceptable:

- `close`, `closes`, `closed`
- `fix`, `fixes`, `fixed`
- `resolve`, `resolves`, `resolved`

**Example**

```
BSD closes #64: Fixed coding standards issues.
```

More guidance on git branching and commit style in [robo.yml](https://github.com/Bixal/bixal-site-drupal/blob/develop/robo.yml) config.

## Development Commands

### Installing Drupal with Sample Content

```
./robo.sh si
```

This installs all the sample content defined in `web/modules/custom/bixal_default_content`.

To export new content from your local, create it locally and run:

```
./robo.sh export-content
```

### Running Drush Commands

```
./drush.sh <your_command>
```

**Example**

```
# Clear cache
./drush.sh cr
```

### npm Workspaces

This repo usees [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) to share and manage root and Drupal theme dependencies in a single place. Because of that, the nested `bixal_uswds` dependencies get hoisted to the root directory.

**Running a workspace script**

Use a `-w` with the workspace's `name` field (found in `bixal_uswds/package.json`).

```bash
# From root, run the `build` script in `bixal_uswds`.
npm run build -w bixaldrop
```

With this setup, you can easily manage both package dependencies using this script:

```bash
npm run check-updates
```

**USWDS asset paths**

The drupal theme uses [`uswds-compile`](https://github.com/uswds/uswds-compile/blob/develop/gulpfile.js), which assumes that USWDS will live inside the local `node_modules`. Now, the gulpfile will resolve to the new, hoisted, path in root to make sure assets are imported correctly.

### Running Composer Commands

By default, Lando runs Composer commands within its Docker containers. This often times out, so we recommend using your local Composer instead.

```
./composer.sh
```

**Local Composer Setup**

1. Install [homebrew](https://brew.sh/):
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. Install composer:

   ```
   brew install composer
   ```

   > [!NOTE]
   > Make sure the installed PHP matches the project version.

3. Set the local to use your composer:
   ```
   echo 'BIN_PATH_COMPOSER="composer"' >> .env
   ```

#### Composer.log Management

The `composer.log` is modified every time you do something that changes the `composer.lock` file.

**Always** use `lando composer` or `./composer.sh` to run composer commands to make sure an entry is made in `composer.log`.

Avoid duplicate entries of the same command in `composer.log`. If you apply to patches, just leave the last `composer update --patch`

#### Run Validation Checks

Run all the validation commands that the pipelines run without needing to push remotely:

```
./robo.sh validate:all
```

To check and fix frontend styles run these commands:

```
npm run format:styles && npm run lint:styles
```

To automatically fix issues run:

```
npm run format:styles:fix
```

```
npm run lint:styles:fix
```

Some problems might still need to be fixed by hand.

#### Copy storybook to Drupal theme

Use this command to view changes from Storybook components.

```
ddev exec './orch/build_node.sh;'
```

```
lando build_node
```

#### Configure Xdebug

https://github.com/mattsqd/drupal-env-lando/wiki/XDebug-(Personal)

## Storybook

[Storybook](https://storybook.js.org/) gives us a preview of UI components.

### Run locally

```
npm run storybook:local
```

Alternatively:

```bash
# Run in terminal.
./sb.sh
```

This should automatically open it in your browser.

## SEO

We're using the following modules:

- [**metatag**](https://www.drupal.org/project/metatag): To set SEO metags to set defaults and let content editors customize metatags.
- [**maxlength**](https://www.drupal.org/project/maxlength): To limit metatag descriptions to `160` characters (recommended in the metatag module).
