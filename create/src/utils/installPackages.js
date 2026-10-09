import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";

export async function installPackages(targetDir) {
  let packageManager = "npm";
  const userAgent = process.env.npm_config_user_agent || "";

  if (userAgent.startsWith("pnpm")) {
    packageManager = "pnpm";
  } else if (userAgent.startsWith("yarn")) {
    packageManager = "yarn";
  } else if (userAgent.startsWith("bun")) {
    packageManager = "bun";
  }

  const dirsToInstall = [];
  
  if (fs.existsSync(path.join(targetDir, 'client'))) {
    dirsToInstall.push(path.join(targetDir, 'client'));
  }
  if (fs.existsSync(path.join(targetDir, 'server'))) {
    dirsToInstall.push(path.join(targetDir, 'server'));
  }
  if (fs.existsSync(path.join(targetDir, 'mobile'))) {
    dirsToInstall.push(path.join(targetDir, 'mobile'));
  }

  if (dirsToInstall.length > 0) {
    for (const dir of dirsToInstall) {
      try {
        execSync(`${packageManager} install`, {
          cwd: dir,
          stdio: "inherit"
        });
      } catch (err) {
        throw new Error(`Failed to run ${packageManager} install in ${path.basename(dir)}`);
      }
    }
  } else {
    try {
      execSync(`${packageManager} install`, {
        cwd: targetDir,
        stdio: "inherit"
      });
    } catch (err) {
      throw new Error(`Failed to run ${packageManager} install`);
    }
  }
}