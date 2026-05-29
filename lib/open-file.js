const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function openFile(filePath) {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  let command;
  let args;

  if (process.platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '', absolutePath];
  } else if (process.platform === 'darwin') {
    command = 'open';
    args = [absolutePath];
  } else {
    command = 'xdg-open';
    args = [absolutePath];
  }

  const child = spawn(command, args, { detached: true, stdio: 'ignore' });
  child.unref();
}

module.exports = {
  openFile,
};
