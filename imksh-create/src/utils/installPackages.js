import { execSync } from "child_process";
import fs from "fs-extra";


export async function installPackages(targetDir) {
  let packageManager = "npm";
  const userAgent = process.env.npm_config_user_agent || "";

  if (userAgent.startsWith("pnpm")) {
    packageManager = "pnpm";
  } else if (userAgent.startsWith("yarn")) {
    packageManager = "yarn";
  }

  try {
    execSync(`${packageManager} install`, {
      cwd: targetDir,
      stdio: "inherit"
    });
  } catch (err) {
    throw new Error(`Failed to run ${packageManager} install`);
  }
}