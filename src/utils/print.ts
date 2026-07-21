import chalk from "chalk";

export function printHeader(text: string) {
	console.info(chalk.bgBlue(text));
}

export function printBody(text: string) {
	console.info(chalk.blue(text));
}
