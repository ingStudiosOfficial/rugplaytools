import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import type { RugplayToolsConfig } from '../interfaces/Config.js';
import { DEFAULT_CONFIG } from './config.js';

async function getStorageFile(): Promise<string> {
	const homedir = os.homedir();

	const dirPath = path.join(homedir, '.rugplaytools');
	await fs.mkdir(dirPath, { recursive: true });

	const storageFile = path.join(dirPath, 'config.json');

	return storageFile;
}

export async function getSettings(): Promise<RugplayToolsConfig> {
	try {
		const fileContents = await fs.readFile(await getStorageFile(), 'utf8');
		return JSON.parse(fileContents);
	} catch (error) {
		return DEFAULT_CONFIG;
	}
}

export async function createDefaultSettings() {
	await updateSettings(DEFAULT_CONFIG);
}

export async function updateSettings(settings: RugplayToolsConfig) {
	const settingsString = JSON.stringify(settings);

	try {
		await fs.writeFile(await getStorageFile(), settingsString);
	} catch (error) {
		console.error('error while writing file:', error);
	}
}
