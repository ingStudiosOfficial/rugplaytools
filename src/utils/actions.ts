import { getSettings } from "./db.js"

export async function transferFunds(user: string, amount: number): Promise<string> {
	const config = await getSettings();

	try {
		const response = await fetch('https://rugplay.com/api/transfer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Cookie': config.cookieHeader,
			},
			body: JSON.stringify({
				recipientUsername: user.trim(),
				type: 'CASH',
				amount: amount,
			}),
		});

		const responseJson = await response.json();
		const message = (responseJson as any).message;

		return message;
	} catch (error) {
		return (error as Error).message;
	}
}

export async function claimDailyReward(): Promise<string> {
	const config = await getSettings();

	try {
		const response = await fetch('https://rugplay.com/api/rewards/claim', {
			headers: {
				'Cookie': config.cookieHeader,
			},
		});
		if (response.ok) {
			return 'Successfully collected daily reward';
		} else {
			return await response.text();
		}
	} catch (error) {
		return 'Failed to collect daily reward';
	}
}
