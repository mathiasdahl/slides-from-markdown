const fs = require('fs');
const path = require('path');

const PACKAGE_ROOT = path.join(__dirname, '..');
const EXAMPLE_DIR = path.join(PACKAGE_ROOT, 'example');

const EXAMPLE_ENTRIES = [
  { name: 'slides.md', type: 'file' },
  { name: 'images', type: 'dir' },
];

function listExampleFiles() {
  const files = [];

  for (const entry of EXAMPLE_ENTRIES) {
    const sourcePath = path.join(EXAMPLE_DIR, entry.name);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Example asset missing from package: ${entry.name}`);
    }

    if (entry.type === 'file') {
      files.push(entry.name);
      continue;
    }

    const walk = (relativeDir) => {
      for (const item of fs.readdirSync(path.join(EXAMPLE_DIR, relativeDir), { withFileTypes: true })) {
        const relativePath = path.join(relativeDir, item.name);
        if (item.isDirectory()) {
          walk(relativePath);
        } else {
          files.push(relativePath.split(path.sep).join('/'));
        }
      }
    };

    walk(entry.name);
  }

  return files;
}

function assertTargetIsAvailable(targetDir, force) {
  if (force) {
    return;
  }

  const conflicts = EXAMPLE_ENTRIES
    .map((entry) => path.join(targetDir, entry.name))
    .filter((targetPath) => fs.existsSync(targetPath));

  if (conflicts.length === 0) {
    return;
  }

  throw new Error(
    `Target already contains example files:\n${conflicts.map((item) => `  ${item}`).join('\n')}\n`
    + 'Use --force to overwrite.',
  );
}

function copyExampleEntry(relativePath, targetDir) {
  const sourcePath = path.join(EXAMPLE_DIR, relativePath);
  const targetPath = path.join(targetDir, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function initExample(options = {}) {
  const targetDir = path.resolve(options.targetDir || process.cwd());
  const force = Boolean(options.force);

  if (!fs.existsSync(EXAMPLE_DIR)) {
    throw new Error(`Example folder not found in package: ${EXAMPLE_DIR}`);
  }

  assertTargetIsAvailable(targetDir, force);
  fs.mkdirSync(targetDir, { recursive: true });

  const created = listExampleFiles();
  for (const relativePath of created) {
    copyExampleEntry(relativePath, targetDir);
  }

  return { targetDir, created };
}

module.exports = {
  initExample,
};
