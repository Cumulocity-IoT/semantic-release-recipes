const headerPattern = '^(\\w*)\\:(\\w*)(?:\\(([\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$';
const headerCorrespondence = ['bundle', 'type', 'scope', 'subject'];
const config = {
    branches: [{ name: 'release/r2024', range: '1019.1.x' }, 'main'],
    ci: true, 
    tagFormat: 'admin-v${version}',
    plugins: [
        ['@semantic-release/commit-analyzer', {
            parserOpts: {
                headerPattern,
                headerCorrespondence
            },
            releaseRules: [
                {
                  bundle: '!(admin)',
                  release: false
                }
              ]
        }],
        ['@semantic-release/release-notes-generator',{
            parserOpts: {
                headerPattern,
                headerCorrespondence
              }
        }],
        '@semantic-release/changelog',
        ['@semantic-release/npm',{npmPublish: false}],
        '@semantic-release/github'
    ]
}
module.exports = config;