import chalk from "chalk";

export function printHeader(text: string) {
	console.log(chalk.bgBlue(text));
}

export function printBody(text: string) {
	console.log(chalk.blue(text));
}
