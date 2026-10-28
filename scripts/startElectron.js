const cp = require('child_process');
const path = require('path');
const electron = require('electron');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = cp.spawn(electron, ['.', '--development-mode'], {
  cwd: path.resolve(__dirname, '..'),
  env,
  stdio: 'inherit',
  windowsHide: false
});

child.on('close', code => {
  process.exit(code || 0);
});

