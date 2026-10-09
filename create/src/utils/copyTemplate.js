/**
 * copyTemplate.js
 *
 * Public API entry point for template copying.
 * Delegates to the composable template engine (composeTemplate.js).
 *
 * Signature is preserved for backward compatibility.
 */
import { composeTemplate } from './composeTemplate.js';

/**
 * Copy/compose a template into the target directory.
 *
 * @param {string} templateName - Preset name (e.g. 'react', 'mern-ts')
 * @param {string} targetDir    - Absolute path to the destination directory
 * @param {string} projectName  - Name to inject into package.json(s)
 */
export async function copyTemplate(templateName, targetDir, projectName) {
  await composeTemplate(templateName, targetDir, projectName);
}
