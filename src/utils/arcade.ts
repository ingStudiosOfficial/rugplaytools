import { getSettings } from "./db.js";

export async function coinflip(amount: number, side: 'heads' | 'tails'): Promise<string> {
	const config = await getSettings();

	const response = await fetch('https://rugplay.com/api/arcade/coinflip', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Cookie': config.cookieHeader,
		},
		body: JSON.stringify({
			amount,
			side,
		}),
	});

	const responseJson: any = await response.json();

	if (!response.ok) {
		return `Failed to perform coinfilp (hint: try betting more than $10)`;
	}

	if (responseJson.won) {
		return `You won ${responseJson.payout} on ${side}`;
	} else {
		return `You lost ${responseJson.amountWagered} on ${side}`;
	}
}
