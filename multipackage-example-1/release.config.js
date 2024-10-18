const config = {
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
module.exports = config;