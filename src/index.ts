import chalk from "chalk";
import { claimDailyReward, getPortfolioValue, transferFunds } from "./utils/actions.js";
import { coinflip } from "./utils/arcade.js";
import { getSettings, updateSettings } from "./utils/db.js";
import { printHeader } from "./utils/print.js";
import * as p from '@clack/prompts';

async function main() {
	printHeader('=== RUGPLAY CLI ===');

	const settings = await getSettings();

	if (!settings.cookieHeader || settings.cookieHeader === '') {
		const cookieHeaderResponse = (await p.text({ message: 'Cookie header (This will be used to authenticate requests)', validate: (value) => {
			if (!value || value?.trim() === '') return 'Header cannot be empty';
		} }));
		if (p.isCancel(cookieHeaderResponse)) {
			p.cancel('Failed to set header');
			process.exit(0);
		}

		const cookieHeader = cookieHeaderResponse.toString();

		settings.cookieHeader = cookieHeader;
		await updateSettings(settings);
		p.outro('Cookie header set successfully');
	}

	try {
		const portfolioData = await getPortfolioValue();
		console.info(chalk.green(`Total: $${portfolioData.totalValue.toFixed(2)}`));
		console.info(chalk.yellow(`Coin holdings: $${portfolioData.totalCoinValue.toFixed(2)}`));
		console.info(chalk.blue(`Cash: $${portfolioData.baseCurrencyValue.toFixed(2)}`));
	} catch (error) {

	}

	const choice = await p.select<string>({ message: 'What would you like to do?', options: [
		{ value: 'switch_account', label: 'Switch account' },
		{ value: 'transfer_funds', label: 'Transfer funds' },
		{ value: 'claim_daily', label: 'Collect daily reward' },
		{ value: 'play_arcade', label: 'Play arcade games' },
	] });
	if (p.isCancel(choice)) {
		p.cancel('Goodbye');
		process.exit(0);
	}

	switch (choice) {
		case 'switch_account': {
			const cookieHeaderResponse = (await p.text({ message: 'Cookie header (This will be used to authenticate requests)', validate: (value) => {
				if (!value || value?.trim() === '') return 'Header cannot be empty';
			} }));
			if (p.isCancel(cookieHeaderResponse)) {
				p.cancel('Failed to set header');
				process.exit(0);
			}

			const cookieHeader = cookieHeaderResponse.toString();

			settings.cookieHeader = cookieHeader;
			await updateSettings(settings);
			p.outro('Successfully switched account');

			break;
		}

		case 'transfer_funds': {
			const user = await p.text({ message: 'User to transfer to' });
			const amount = await p.text({ message: 'Amount to transfer' });
			const response = await transferFunds(user.toString(), parseInt(amount.toString()));
			p.outro(response);
			break;
		}

		case 'claim_daily': {
			const response = await claimDailyReward();
			p.outro(response);
			break;
		}

		case 'play_arcade': {
			const game = await p.select<string>({ message: 'What would you like to play?', options: [
				{ value: 'coinflip', label: 'Coinflip' },
			] });
			if (p.isCancel(game)) {
				p.cancel('Goodbye');
				process.exit(0);
			}

			switch (game) {
				case 'coinflip': {
					const amount = await p.text({ message: 'Amount to bet' });
					if (p.isCancel(amount)) {
						p.cancel('Goodbye');
						process.exit(0);
					}

					const side = await p.select<string>({ message: 'Side to bet on', options: [
						{ value: 'heads', label: 'Heads' },
						{ value: 'tails', label: 'Tails' },
					] });
					if (p.isCancel(side)) {
						p.cancel('Goodbye');
						process.exit(0);
					}

					const amountNumber = parseInt(amount.toString());
					const headsOrTails: 'heads' | 'tails' = side as 'heads' | 'tails';

					const result = await coinflip(amountNumber, headsOrTails);

					p.outro(result);

					break;
				}
			}

			break;
		}
	}
}

main();
