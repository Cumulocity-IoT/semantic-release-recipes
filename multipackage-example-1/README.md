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
       ['@semantic-release/git', { assets: ['packages/*/package.json','CHANGELOG.md'], message: 'chore(release): ${nextRelease.version} [skip ci]' }],
       '@semantic-release/github' // publishes the release to GitHub
    ]
}
```
The above configuration also has customized release rules that indicate semantic-release to increment the patch version for `test` and `ci` commit types.