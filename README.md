## Semantic release

`semantic-release` is a tool that automates the package release workflow including: determining the next version number, generating the release notes, and publishing the package. Using commit messages in a formalized convention, it automatically determines the next semantic version number, generates a changelog and optionally publishes the release.

### Commit messages
By default, semantic-release uses [Angular Commit Message Conventions](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format). Each commit message consists of a header, a body and a footer.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
The header must conform to the below format
```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: Can be, but not limited to
  |                          animations|bazel|benchpress|common|compiler|compiler-cli|core|
  │                          elements|forms|http|language-service|localize|platform-browser|
  │                          platform-browser-dynamic|platform-server|router|service-worker|
  │                          upgrade|zone.js|packaging|changelog|docs-infra|migrations|
  │                          devtools
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

### Plugins and Extendability

semantic-release has rich ecosystem of plugins that can be used to customize the release process. Some of the popular plugins include:
- [@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer): Analyzes commits to determine the type of version bump.
- [@semantic-release/release-notes-generator](https://github.com/semantic-release/release-notes-generator): Generates release notes based on commits.
- [@semantic-release/changelog](https://github.com/semantic-release/changelog): Generates or updates a changelog file.
- [@semantic-release/npm](https://github.com/semantic-release/npm): Publishes the package to NPM.
- [@semantic-release/github](https://github.com/semantic-release/github): Publishes releases on GitHub.

For a full list of plugins, refer to the [Plugins List](https://semantic-release.gitbook.io/semantic-release/extending/plugins-list).

The commit message format can be easily customized in the config options of the [@semantic-release/commit-analyzer](https://github.com/semantic-release/commit-analyzer#options) and [@semantic-release/release-notes-generator](https://github.com/semantic-release/release-notes-generator#options) plugins.
See [Multi-package bundle example](/multipackage-example-2/ui/packages/analytics/release.config.js) release configuration.

It is also easy to create custom plugins tailored to your requirements following [Plugin development](https://semantic-release.gitbook.io/semantic-release/developer-guide/plugin) documentation.

[semantic-release-monorepo](https://github.com/SoftwareAG/semantic-release-monorepo) and [semantic-release-monorepo-git](https://github.com/SoftwareAG/semantic-release-monorepo-git) are custom plugins created for releases where multiple packages must be bundled together into a single release. See [Multi-package bundle](#multi-package-bundle-a-mono-repository-with-multiple-projects).


The [Semantic release GitBook](https://semantic-release.gitbook.io/semantic-release) has the complete documentation of usage including example recipes.

## Setup

To set up semantic release for a project, you need to:

1. Install Node.js.
2. Install the semantic release package and the necessary plugins.
3. Configure the release settings.
4. Optionally, if you are using a CI environment, you can integrate semantic release into your CI pipeline for automated releases.


## Understanding the examples structure
This repository provides examples for common project setups. The examples use JavaScript to define the semantic-release configuration *release.config.js*. For other options and usage, please refer to the [semantic-release configuration](https://semantic-release.gitbook.io/semantic-release/usage/configuration) documentation.

> IMPORTANT: Each folder represents the folder structure of a repository. Therefore, the `.github/workflows` folder is also included to demonstrate integration with GitHub Actions.

Each example section provides a summary of what type of project it caters to and a quick view of necessary configuration for easy understanding. Click on the links in each section to view the complete files.

## Examples

> <b style="color:green"> NOTE ⚠️: Please note that the semantic-release configuration is not something that is one-size-fits-all. It is crucial to customize the setup based on the specific requirements and structure of your repository. These examples provide you a good starting point when setting up semantic release for your project.</b>

### Nodejs Applications

[**c8y-webapp**](/c8y-webapp/) is a repository structure for a project with a single cumulocity web application. For a nodejs application the semantic-release package and plugins can be added as dev dependencies.

```
package.json

"devDependencies": {
    "@angular-devkit/build-angular": "^17.3.8",
    "@angular/cli": "^17.3.8",
    "@angular/compiler-cli": "^17.3.0",
    "@c8y/devkit": "1020.4.1",
    "@c8y/options": "1020.4.1",
    *"@semantic-release/changelog": "^6.0.3",*
    *"@semantic-release/github": "^10.1.1",*
    "@types/jasmine": "~5.1.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    *"semantic-release": "^24.0.0"*,
    "typescript": "~5.4.2"
  }

```
In this example, the branch names are based on default convention, where the release branch is named `master`, the pre-release branch is named `next`, and maintenance branches are named with a version number, for example, `N.x.x`. For more information on the release configuration for different scenarios, refer to the [semantic-release configuration branches](https://semantic-release.gitbook.io/semantic-release/usage/configuration#branches) documentation.

By default, this example is not configured to publish to npm. For details on npm registry authentication and publish configuration, please refer to the [@semantic-release/npm](https://github.com/semantic-release/npm) documentation.

Here is a quick view of the configuration
```
// release.config.js
{
    branches: ['+([0-9])?(.{+([0-9]),x}).x','main','next'], // branches which trigger a release; order is very important and there must be atleast one branch
    ci: false, // enabled to run the release on CI
    tagFormat: 'v${version}', // tag format with with the releases are named
    plugins: [
        '@semantic-release/commit-analyzer', // analyzes commits to determine the release type
        '@semantic-release/release-notes-generator', // generates release notes
        '@semantic-release/changelog', // creates a changelog
        ['@semantic-release/npm',{npmPublish: false}], // prepares the release without publishing to npm
        ['@semantic-release/git', { assets: ['CHANGELOG.md'], message: 'chore(release): ${nextRelease.version} [skip ci]' }], // commits the changelog
        '@semantic-release/github' // publishes the release to GitHub
    ]
} 
```

### Other projects (Example: Maven)

The [**microservice**](/microservice/) is an example repository structure for a maven Java project. As described earlier in the [Setup](#setup), semantic-release requires Nodejs installation. Ensure that it is available in your CI environment. Refer to the [semantic release workflow](/microservice/.github/workflows/semantic-release.yml) for more details on how setup NodeJS, install semantic-release package and required plugins in GitHub Actions.

In this example, `@semantic-release/exec` plugin is used to update the version in the `pom.xml` file. This is a generic plugin that allows you to run commands during the semantic release process. Depending on your requirements, you can use any other plugin to update the version in any file.

A quick view of semantic release configuration
```
// release.config.js
 {
    branches: [{ name: 'release/r2024', range: '1.0.x' }, 'main'], // the range ensures that only fixes are released from the maintenance branch
    ci: true,
    tagFormat: 'v${version}',
    plugins: [
        '@semantic-release/commit-analyzer', // analyzes commits to determine the release type
        '@semantic-release/release-notes-generator', // generates release notes
        '@semantic-release/changelog', // creates a changelog
        ['@semantic-release/exec',{
            prepareCmd: 'mvn versions:set -DnewVersion="${nextRelease.version}"' // updates the version in the pom.xml
        }],
        ['@semantic-release/git', { assets: ['pom.xml'], message: 'chore(release): ${nextRelease.version} [skip ci]' }], // commits the updated version; [skip ci] avoids a CI loop
        '@semantic-release/github' // publishes the release to GitHub
    ]
}
```

### Multi-package bundle: Multiple packages in a workspace with same version

The [multipackage-example-1](/multipackage-example-1/) is an example repository structure for a mono-repository with multiple packages in a workspace. semantic-release and the plugins are added as dev dependencies in the [workspace package.json](/multipackage-example-1/package.json).

```
// workspace package.json
 "private":"true",
  "workspaces": [
    "packages/*"
  ],
  "devDependencies": {
    "@semantic-release/changelog": "^6.0.3",
    "@semantic-release/exec": "6.0.3",
    "@semantic-release/git": "10.0.1",
    "@semantic-release/github": "^9.2.6",
    "fast-glob": "^3.3.2",
    "semantic-release": "22.0.12"
  }

```

The, `@semantic-release/exec` plugin invokes a [NodeJS script](/multipackage-example-1/tools/update-versions.js)  that updates the versions of all packages within the workspace. 

```
// release.config.js
{
    branches: [{ name: 'release/r2024', range: '1.0.x' }, 'main'], // branches which trigger a release; order is very important and there must be atleast one branch
    ci: true, // enabled to run the release on CI
    tagFormat: 'v${version}', // tag format with with the releases are named
    plugins: [
        ['@semantic-release/commit-analyzer',{
            releaseRules: [ // customizing release rules to increment the patch version for test and ci commit types
                { type: 'test', scope: 'fix', release: 'patch' },
                { type: 'ci', scope: 'fix', release: 'patch' }
              ]
        }], // analyzes commits to determine the release type
        '@semantic-release/release-notes-generator', // generates release notes
        '@semantic-release/changelog', // creates a changelog
        ['@semantic-release/exec',{
            prepareCmd: 'node tools/update-versions.js ${nextRelease.version}"' // invokes a script to update the version in the library
        }],
       ['@semantic-release/git', { assets: ['packages/*/package.json', 'CHANGELOG.md'], message: 'chore(release): ${nextRelease.version} [skip ci]' }],
       '@semantic-release/github' // publishes the release to GitHub
    ]
}
```
The above configuration also has customized release rules that indicate semantic-release to increment the patch version for `test` and `ci` commit types.

### Multi-package bundle: A mono-repository with multiple projects
The [multipackage-example-2](/multipackage-example-2/) recipe demonstrates how to set up semantic release in a mono-repository with multiple projects that have independent releases.

The project is structured as follows:

```
multipackage-example-2/
├── ui/
│   ├── packages/
│           ├── administration/
│           ├── common/
│           └── analytics/
└── backend/
    ├── messaging/
    ├── common/
    └── apis/
```

It consists of two directories: *ui* and *backend*.

The *ui* directory is a workspace with *administration*, *analytics*, and *common* packages under the *packages* folder. The *administration* and *analytics* are standalone applications, and *common* is a library of common functionality.
The *backend* directory consists of Maven Java SpringBoot applications *apis* and *messaging*, and *common* is a library that provides common functionality.

The *administration* application is released standalone, while the *analytics* and *messaging* applications are released as a bundle, sharing the same version.

To configure semantic release for releasing the *administration* application and the *analytics* bundle:

First, determine where to have the semantic release configuration. Since *administration* and *analytics* are Node.js applications, we can add semantic release as a devDependency in the workspace and have the release configuration `release.config.js` file added to the root of each project. Note that only a single semantic release configuration is required for a bundle, and it can be placed in any of the packages.

```
multipackage-example-2/
├── ui/
   ├── packages/
           ├── administration/
           │    ├── release.config.js
           ├── common/
           └── analytics/
                ├── release.config.js
```

Next, define the release branches in the configuration:

```javascript
branches: [{ name: 'release/r2024', range: '1019.1.x' }, 'main']
```

The order of the branch names is crucial. The maintenance branches are listed first, followed by the current release branch and any pre-release branches. In this example, the maintenance branch is 'release/r2024', and the range indicates that only fixes can be released from that branch. The current release branch is 'main'.

Next, add the required plugins:

```javascript
plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    'semantic-release-monorepo',
    'semantic-release-monorepo-git',
    '@semantic-release/github'
]
```

The semantic-release tool needs a way to identify commits for each releasable application or bundle. To achieve this, set a unique tag format for each releasable package or bundle.

```javascript
// administration/release.config.js
tagFormat: 'admin-v${version}'
```

```javascript
// analytics/release.config.js
tagFormat: 'analytics-v${version}'
```

This creates tags in the above format when semantic release makes a GitHub release.

To identify the commits that belong to each releasable package or bundle, customize the commit message format. Pass the custom `headerPattern` and `headerCorrespondence` parser options to the *@semantic-release/commit-analyzer* and *@semantic-release/release-notes-generator* plugins to achieve this.

We change the commit message format to 
```
<bundle>:<type>(<scope>): <short summary>
    │
    └─⫸ An identifier to differentiate different bundles or packages
```

```javascript
plugins: [
    ['@semantic-release/commit-analyzer',{
        parserOpts: {
          headerPattern: '^(\\w*)\\:(\\w*)(?:\\(([\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$',
          headerCorrespondence: ['bundle', 'type', 'scope', 'subject']
        }
    }],
    [
      '@semantic-release/release-notes-generator',
      {
        parserOpts: {
          headerPattern: '^(\\w*)\\:(\\w*)(?:\\(([\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$',
          headerCorrespondence: ['bundle', 'type', 'scope', 'subject']
        }
      }
    ]
]
```
Instruct semantic release to ignore commit messages that don't have the bundle name in them.
```javascript
//administration/release.config.js
plugins: [
    ['@semantic-release/commit-analyzer',{
        parserOpts: {
          headerPattern: '^(\\w*)\\:(\\w*)(?:\\(([\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$',
          headerCorrespondence: ['bundle', 'type', 'scope', 'subject']
        },
        releaseRules: [
          {
            bundle: '!(admin)',
            release: false
          }
        ]
    }]
]

```
```javascript
//analytics/release.config.js
plugins: [
    ['@semantic-release/commit-analyzer',{
        parserOpts: {
          headerPattern: '^(\\w*)\\:(\\w*)(?:\\(([\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$',
          headerCorrespondence: ['bundle', 'type', 'scope', 'subject']
        },
        releaseRules: [
          {
            bundle: '!(analytics)',
            release: false
          }
        ]
    }]
]

```

Next, configure the `semantic-release-monorepo` plugin to update the version in all the packages of a bundle. 
```javascript
// analytics/release.config.js
plugins: [
    [
      'semantic-release-monorepo',
      {
        dependencies: [
          {
            pkgRoot: '../../../backend/messaging',
            type: 'maven'
          }
        ]
      }
    ]
]
```

Then configure the `semantic-release-monorepo-git` plugin to commit all the files updated in the previous step.
```javascript
// analytics/release.config.js
[
      'semantic-release-monorepo-git',
      {
        workspaceRoot: '../../..',
        assets: [
          'ui/packages/analytics/package.json',
          'ui/packages/analytics/CHANGELOG.md',
          'backend/messaging/pom.xml'
        ],
        message: 'chore(release): Analytics bundle ${nextRelease.version} [skip ci]'
      }
    ]
```
See [Administration release configuration](/multipackage-example-2/ui/packages/administration/release.config.js) and [Analytics release configuration](/multipackage-example-2/ui/packages/analytics/release.config.js) for the complete configuration.

## Integration with GitHub Actions CI
The [semantic-release.yml](/multipackage-example-2/.github/workflows/semantic-release.yml) GitHub workflow contains the steps to integrate semantic release with GitHub Actions CI for a mono-repository with multiple projects.
If you have a protected branch from where semantic release is run, create a GitHub app to generate access tokens and use that when running the semantic release.  The [semantic-release-protected-branch.yml](/multipackage-example-2/.github/workflows/semantic-release-protected-branch.yml) contains the implementation.
For more information, see [actions/create-github-app-token](https://github.com/actions/create-github-app-token)