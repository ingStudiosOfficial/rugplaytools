import { claimDailyReward, transferFunds } from "./utils/actions.js";
import { getSettings, updateSettings } from "./utils/db.js";
import { printBody, printHeader } from "./utils/print.js";
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

	const choice = await p.select<string>({ message: 'What would you like to do?', options: [
		{ value: 'switch_account', label: 'Switch account' },
		{ value: 'transfer_funds', label: 'Transfer funds' },
		{ value: 'claim_daily', label: 'Collect daily reward' },
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
			const success = await claimDailyReward();
			p.outro(success ? 'Successfully collected daily reward' : 'Failed to collect daily reward');
			break;
		}
	}
}

main();
