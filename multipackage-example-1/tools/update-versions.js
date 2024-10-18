const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');

const newVersion = process.argv[2];

if (!newVersion) {
    console.error('Please provide a new version.');
    process.exit(1);
}

const packageJsonFiles = fg.sync('packages/*/package.json');
// for each package.json file, update the version
packageJsonFiles.forEach((packageJsonFile) => {
    const packageJsonPath = path.resolve(packageJsonFile);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
});
