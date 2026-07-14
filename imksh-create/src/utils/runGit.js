import { execSync } from "child_process";

export async function runGit(targetDir) {
  try {
    execSync("git init", { cwd: targetDir, stdio: "ignore" });
    execSync("git add .", { cwd: targetDir, stdio: "ignore" });
    execSync("git commit -m \"Initial commit from @imksh/cli\"", { cwd: targetDir, stdio: "ignore" });
  } catch (err) {
    throw new Error("Git initialization failed");
  }
}


