c8y-webapp is a repository structure for a project with a single cumulocity web application. For a nodejs application the semantic-release package and plugins can be added as dev dependencies.

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