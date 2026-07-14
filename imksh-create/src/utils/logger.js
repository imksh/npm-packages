import chalk from 'chalk';

export function info(message) {
  console.log(chalk.blue(message));
}

export function success(message) {
  console.log(chalk.green(message));
}

export function warning(message) {
  console.log(chalk.yellow(message));
}

export function error(message) {
  console.error(chalk.red(message));
}
