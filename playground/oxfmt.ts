import { readFile, writeFile } from 'node:fs/promises';
import type { PathLike } from 'node:fs';

// ============================================================================
// Types
// ============================================================================

type Result<T> = { status: 'success'; value: T } | { error: Error; status: 'failure' };
type PreferencePath = PathLike;

interface PreferenceStore {
	load(filePath: string): Promise<Result<typeof preferences>>;
	save(filePath: string, value: typeof preferences): Promise<void>;
}

const preferences = {
	favoriteLanguages: ['TypeScript', 'Rust', 'Go'],
	notifications: { email: true, push: false },
	theme: 'dark'
};

type PreferenceOptions = { createWhenMissing: boolean; fallback: typeof preferences };

const environmentByName = new Map([
	['development', { logging: true, retries: 0 }],
	['production', { logging: false, retries: 3 }]
]);

// ============================================================================
// Classes
// ============================================================================

export class FilePreferenceStore implements PreferenceStore {
	public constructor(private readonly options: PreferenceOptions) {}

	public load(filePath: string): Promise<Result<typeof preferences>> {
		return loadPreferences(filePath, this.options);
	}

	public async save(filePath: string, value: typeof preferences): Promise<void> {
		await writeFile(filePath, JSON.stringify(value));
	}
}

// ============================================================================
// Functions
// ============================================================================

export async function loadPreferences(
	filePath: string,
	options: PreferenceOptions
): Promise<Result<typeof preferences>> {
	try {
		const contents = await readFile(filePath, 'utf8');
		return { status: 'success', value: JSON.parse(contents) as typeof preferences };
	} catch (error) {
		if (options.createWhenMissing) {
			await writeFile(filePath, JSON.stringify(options.fallback));
			return { status: 'success', value: options.fallback };
		}

		return { error: error instanceof Error ? error : new Error(String(error)), status: 'failure' };
	}
}

export const enabledChannels = Object.entries(preferences.notifications)
	.filter(([, enabled]) => enabled)
	.map(([channel]) => channel);

export const describeEnvironment = (name: string): string =>
	environmentByName.has(name)
		? `${name} uses ${environmentByName.get(name)?.retries ?? 0} retries`
		: 'unknown environment';

// ============================================================================
// Calls and collections
// ============================================================================

export const languageLabels = preferences.favoriteLanguages
	.map((language, index) => ({ index, label: `${index + 1}. ${language.toUpperCase()}` }))
	.sort((left, right) => left.label.localeCompare(right.label));
