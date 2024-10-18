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