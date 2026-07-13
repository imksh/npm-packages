import { execa } from 'execa';

export async function runGit(targetDir) {
  try {
    await execa('git', ['init'], { cwd: targetDir, stdio: 'ignore' });
    await execa('git', ['add', '.'], { cwd: targetDir, stdio: 'ignore' });
    await execa('git', ['commit', '-m', 'Initial commit from @imksh/cli'], { cwd: targetDir, stdio: 'ignore' });
  } catch (err) {
    throw new Error('Git initialization failed');
  }
}
