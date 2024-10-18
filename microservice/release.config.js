// contains semantic release configuration
// with branches named release/r<year> for maintenance branches, main for the release branch
const config = {
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
module.exports = config;