// create a semantic-release configuration file which uses standard branch names
// and tags the releases with a 'v' prefix
// uses the default plugins for commit analysis, release notes generation, changelog creation and publishing to npm
const config = {
    branches: ['+([0-9])?(.{+([0-9]),x}).x','main','next'], // branches which trigger a release; order is very important and there must be atleast one branch
    ci: true, // enabled to run the release on CI
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
module.exports = config;