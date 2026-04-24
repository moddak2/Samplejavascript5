const fs = require('fs');
const path = require('path');

// Minimal "build" step for plain Node.js projects:
// - validates that source files parse
// - emits a dist/ folder as a runnable copy

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const distDir = path.join(projectRoot, 'dist');

function main() {
  ensureDirEmpty(distDir);
  copyDir(srcDir, path.join(distDir, 'src'));

  // Quick parse check by requiring the entry file.
  // (This will not start the server.)
  // eslint-disable-next-line global-require, import/no-dynamic-require
  require(path.join(srcDir, 'app.js'));

  console.log('build ok');
}

function ensureDirEmpty(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyDir(fromPath, toPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

main();
