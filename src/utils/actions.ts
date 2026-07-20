import { getSettings } from "./db.js"

export async function transferFunds(user: string, amount: number): Promise<string> {
	const config = await getSettings();

	const response = await fetch('https://rugplay.com/api/transfer', {
		method: 'POST',
		headers: {
			'accept': '*/*',
			'accept-language': 'en-SG,en;q=0.9,my-MM;q=0.8,my;q=0.7,en-GB;q=0.6,en-US;q=0.5',
			'content-type': 'application/json',
			'origin': 'https://rugplay.com',
			'priority': 'u=1, i',
			'referer': 'https://rugplay.com/',
			'sec-ch-ua': '"Not;A=Brand";v="8", "Chromium";v="150", "Google Chrome";v="150"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"macOS"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-origin',
			'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
			'cookie': config.cookieHeader,
		},
		body: JSON.stringify({
			recipientUsername: user,
			type: 'CASH',
			amount: amount,
		})
	});

	const responseJson = await response.json();
	const message = (responseJson as any).message;

	return message;
}
