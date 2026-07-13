import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function copyTemplate(templateName, targetDir, projectName) {
  const templateDir = path.resolve(__dirname, '../../templates', templateName);

  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory not found: ${templateDir}`);
  }

  // Copy template files
  await fs.copy(templateDir, targetDir, {
    filter: (src) => {
      // Exclude node_modules if they accidentally exist in template
      return !src.includes('node_modules');
    }
  });

  // Rename package.json project name
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    pkg.name = projectName;
    await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
  }

  // Rename _gitignore to .gitignore
  const gitignorePath = path.join(targetDir, '_gitignore');
  if (fs.existsSync(gitignorePath)) {
    await fs.rename(gitignorePath, path.join(targetDir, '.gitignore'));
  }
}
