const path = require('path').join(__dirname, 'build', 'index.html');
const exist = require('fs').existsSync(path);
if (!exist) {
    const cmd = 'npm run build';
    process.stdout.write(`Build not found\n> ${cmd}\n`);
    require('child_process').execSync(cmd);
}
process.stdout.write(`Opening ${path}`);
require('open')(path);
