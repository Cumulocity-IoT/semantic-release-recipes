const headerPattern = '^(\\w*)\\:(\\w*)(?:\\(([\\w\\$\\.\\-\\* ]*)\\))?\\: (.*)$';
const headerCorrespondence = ['bundle', 'type', 'scope', 'subject'];
const config = {
    branches: [{ name: 'release/r2024', range: '1019.1.x' }, 'main'],
    ci: true, 
    tagFormat: 'analytics-v${version}',
    plugins: [
        ['@semantic-release/commit-analyzer', {
            parserOpts: {
                headerPattern,
                headerCorrespondence
            },
            releaseRules: [
                {
                  bundle: '!(analytics)',
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
        ['semantic-release-monorepo',{
            dependencies: [
                {
                  pkgRoot: '../../../backend/messaging',
                  type: 'maven'
                }
              ]
        }],
        ['semantic-release-monorepo-git',
            {
            workspaceRoot: '../../..',
            assets: [
                'ui/packages/analytics/package.json',
                'ui/packages/analytics/CHANGELOG.md',
                'backend/messaging/pom.xml'
            ],
            message: 'chore(release): Analytics bundle ${nextRelease.version} [skip ci]'
            }
        ],
        '@semantic-release/github'
    ]
}
module.exports = config;