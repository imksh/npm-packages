import { execa } from 'execa';

export async function installPackages(targetDir) {
  // Detect package manager based on process.env.npm_config_user_agent
  let pm = 'npm';
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith('yarn')) {
      pm = 'yarn';
    } else if (userAgent.startsWith('pnpm')) {
      pm = 'pnpm';
    }
  }

  // Handle mern template differently (it might need install in root, or client/server separately)
  // Our mern template will be designed such that 'npm install' at root installs everything
  // using workspaces or postinstall scripts.
  
  await execa(pm, ['install'], {
    cwd: targetDir,
    stdio: 'ignore'
  });
}
