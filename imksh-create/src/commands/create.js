import fs from 'fs-extra';
import path from 'path';
import { info, success, error } from '../utils/logger.js';
import { askTemplate } from '../utils/askTemplate.js';
import { copyTemplate } from '../utils/copyTemplate.js';
import { installPackages } from '../utils/installPackages.js';
import { runGit } from '../utils/runGit.js';
import ora from 'ora';

export default async function createCommand(projectName, options) {
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    throw new Error(`Folder ${projectName} already exists. Please choose a different name or delete the folder.`);
  }

  let template = options.template;

  if (!template) {
    if (options.yes) {
      template = 'react';
    } else {
      template = await askTemplate();
    }
  }

  const validTemplates = [
    'react',
    'react-ts',
    'node',
    'node-ts',
    'node-prisma',
    'node-prisma-ts',
    'mern',
    'mern-ts',
    'next',
    'next-ts',
    'react-native',
    'mern-react-native'
  ];
  if (!validTemplates.includes(template)) {
    throw new Error(`Invalid template "${template}". Valid templates are: ${validTemplates.join(', ')}`);
  }

  info(`\nCreating project in ${targetDir}...`);
  const copySpinner = ora('Copying template...').start();
  try {
    await copyTemplate(template, targetDir, projectName);
    copySpinner.succeed('Template copied successfully.');
  } catch (err) {
    copySpinner.fail('Failed to copy template.');
    throw err;
  }

  if (!options.skipInstall) {
    const installSpinner = ora('Installing dependencies...').start();
    try {
      await installPackages(targetDir);
      installSpinner.succeed('Dependencies installed successfully.');
    } catch (err) {
      installSpinner.fail('Failed to install dependencies.');
      error(err.message);
    }
  } else {
    info('Skipping dependency installation.');
  }

  if (options.git !== false) {
    const gitSpinner = ora('Initializing git...').start();
    try {
      await runGit(targetDir);
      gitSpinner.succeed('Git initialized successfully.');
    } catch (err) {
      gitSpinner.warn('Failed to initialize git (is git installed?)');
    }
  } else {
    info('Skipping git initialization.');
  }

  success(`\nProject ${projectName} created successfully!`);
  info(`\nTo get started:\n`);
  info(`  cd ${projectName}`);
  if (options.skipInstall) {
    info(`  npm install`);
  }
  
  if (template === 'mern') {
    info(`  npm run dev (or follow README in the generated project)\n`);
  } else {
    info(`  npm run dev\n`);
  }
}
