import type { Portfolio } from "../interfaces/Portfolio.js";
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

		if (response.ok) {
			return `Successfully transfered $${amount} to @${user}`;
		}

		const responseJson = await response.json();
		const message = (responseJson as any).message;

		return message || JSON.stringify(responseJson);
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

		const responseJson: any = await response.json();

		if (response.ok) {
			if (responseJson.canClaim) {
				return 'Successfully claimed daily reward';
			} else {
				return 'Daily reward already claimed';
			}
		} else {
			return await response.text();
		}
	} catch (error) {
		return 'Failed to collect daily reward';
	}
}

export async function getPortfolioValue(): Promise<Portfolio> {
	const config = await getSettings();

	const response = await fetch('https://rugplay.com/api/portfolio/total', {
		headers: {
			'Cookie': config.cookieHeader,
		},
	});

	if (response.ok) {
		const responseJson: any = await response.json();

		const portfolioData: Portfolio = {
			baseCurrencyValue: responseJson.baseCurrencyBalance,
			totalCoinValue: responseJson.totalCoinValue,
			totalValue: responseJson.totalValue,
		};

		return portfolioData;
	} else {
		throw new Error('failed to fetch portfolio data');
	}
}
