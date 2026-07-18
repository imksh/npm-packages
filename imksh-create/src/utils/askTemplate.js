import inquirer from 'inquirer';

export async function askTemplate() {
  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Which framework would you like to use?',
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Node.js', value: 'node' },
        { name: 'MERN Stack', value: 'mern' },
        { name: 'React Native', value: 'react-native' },
        { name: 'MERN + React Native', value: 'mern-react-native' },
        { name: 'Next.js', value: 'next' },
      ],
    },
  ]);

  if (framework === 'react' || framework === 'next' || framework === 'mern') {
    const { language } = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'Which language would you like to use?',
        choices: [
          { name: 'JavaScript', value: 'js' },
          { name: 'TypeScript', value: 'ts' },
        ],
      },
    ]);
    return language === 'ts' ? `${framework}-ts` : framework;
  }

  if (framework === 'node') {
    const { variant } = await inquirer.prompt([
      {
        type: 'list',
        name: 'variant',
        message: 'Which variant would you like to use?',
        choices: [
          { name: 'Standard (MongoDB/Express)', value: 'standard' },
          { name: 'Prisma ORM', value: 'prisma' },
        ],
      },
    ]);
    const { language } = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'Which language would you like to use?',
        choices: [
          { name: 'JavaScript', value: 'js' },
          { name: 'TypeScript', value: 'ts' },
        ],
      },
    ]);
    if (variant === 'prisma') {
      return language === 'ts' ? 'node-prisma-ts' : 'node-prisma';
    }
    return language === 'ts' ? 'node-ts' : 'node';
  }

  return framework;
}
