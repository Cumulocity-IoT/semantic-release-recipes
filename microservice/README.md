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