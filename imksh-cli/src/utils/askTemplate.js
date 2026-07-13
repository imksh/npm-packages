import inquirer from 'inquirer';

export async function askTemplate() {
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        { name: 'React (JS)', value: 'react' },
        { name: 'React (TS)', value: 'react-ts' },
        { name: 'Node (JS)', value: 'node' },
        { name: 'Node (TS)', value: 'node-ts' },
        { name: 'Node + Prisma (JS)', value: 'node-prisma' },
        { name: 'Node + Prisma (TS)', value: 'node-prisma-ts' },
        { name: 'MERN (JS)', value: 'mern' },
        { name: 'MERN (TS)', value: 'mern-ts' },
        { name: 'Next.js (JS)', value: 'next' },
        { name: 'Next.js (TS)', value: 'next-ts' },
      ],
    },
  ]);
  
  return template;
}
