import type { Meme } from '../meme-registry';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { startMemeBrowser } from '../meme-browser';

const MEMES = [
	{ filename: 'vwap-maxxer.png', tags: ['ict', 'vwap'], title: 'VWAP Maxxer' },
	{ filename: 'cobd-gang.png', tags: ['cobd'], title: 'C.O.B.D GANG' }
] as const satisfies readonly Meme[];
const stops: Array<() => void> = [];

const startBrowser = (overrides: Partial<Parameters<typeof startMemeBrowser>[2]> = {}) => {
	document.body.innerHTML = '<div id="app"></div>';
	const root = document.querySelector<HTMLDivElement>('#app');

	if (!root) {
		throw new Error('Test app root not found.');
	}

	const dependencies = {
		copyImage: async () => true,
		document,
		...overrides
	};

	const stop = startMemeBrowser(root, MEMES, dependencies);
	stops.push(stop);

	return { root, stop };
};

afterEach(() => {
	stops.splice(0).forEach((stop) => stop());
	vi.restoreAllMocks();
	vi.useRealTimers();
	document.body.innerHTML = '';
});

describe('startMemeBrowser', () => {
	it('fails clearly when the app root is not mounted in the document', () => {
		const detachedRoot = document.createElement('div');

		expect(() =>
			startMemeBrowser(detachedRoot, MEMES, {
				copyImage: async () => true,
				document
			})
		).toThrow('Required meme browser element not found: #meme-search');
	});

	it('renders accessible controls and filters free-text searches', () => {
		const { root, stop } = startBrowser();
		const search = root.querySelector<HTMLInputElement>('#meme-search');

		expect(root.querySelector('h1')?.textContent).toBe('Trader Memes');
		expect(root.querySelectorAll('.meme-card')).toHaveLength(2);
		expect(root.querySelector('[data-copy]')?.getAttribute('aria-label')).toBe(
			'Copy link for VWAP Maxxer'
		);

		if (!search) {
			throw new Error('Search input not found.');
		}

		search.value = 'missing';
		search.dispatchEvent(new Event('input'));

		expect(root.querySelectorAll('.meme-card')).toHaveLength(0);
		expect(root.querySelector('#empty-state')?.hasAttribute('hidden')).toBe(false);
		expect(root.querySelector('#result-status')?.textContent).toBe('No memes found.');

		search.focus();
		search.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
		expect(root.querySelectorAll('.meme-card')).toHaveLength(2);

		stop();
	});

	it('uses exact matching when a tag button is selected', () => {
		const { root, stop } = startBrowser();
		const tag = root.querySelector<HTMLButtonElement>('[data-tag="ict"]');

		tag?.click();

		expect(root.querySelectorAll('.meme-card')).toHaveLength(1);
		expect(root.querySelector('.meme-card h2')?.textContent).toBe('VWAP Maxxer');
		expect(root.querySelector('#result-status')?.textContent).toBe('1 meme found.');

		stop();
	});

	it('shows the minimal empty state and ignores unrelated document events', () => {
		const { root, stop } = startBrowser();
		const search = root.querySelector<HTMLInputElement>('#meme-search');

		if (!search) {
			throw new Error('Search input not found.');
		}

		document.dispatchEvent(new Event('click', { bubbles: true }));
		document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
		search.value = 'missing';
		search.dispatchEvent(new Event('input'));

		expect(search.value).toBe('missing');
		expect(root.querySelectorAll('.meme-card')).toHaveLength(0);
		expect(root.querySelector('#empty-state')?.hasAttribute('hidden')).toBe(false);
		expect(root.querySelector('.empty-state__mark')?.textContent).toBe('×');
		expect(root.querySelector('#empty-state p')).toBeNull();
		expect(root.querySelector('#empty-state button')).toBeNull();

		stop();
	});

	it('shows an error when the copy strategy reports unsupported', async () => {
		const { root, stop } = startBrowser({
			copyImage: async () => false
		});

		root.querySelector<HTMLButtonElement>('[data-copy]')?.click();

		await vi.waitFor(() =>
			expect(root.querySelector('#toast')?.textContent).toContain("Copy isn't supported")
		);
		expect(root.querySelector('#toast')?.classList).toContain('toast--error');

		stop();
	});

	it('invokes the copy strategy and restores the copy button after success', async () => {
		const copyImage = vi.fn<(path: string) => Promise<boolean>>(async () => true);
		const { root, stop } = startBrowser({ copyImage });
		const copyButton = root.querySelector<HTMLButtonElement>('[data-copy]');

		vi.useFakeTimers();
		copyButton?.click();
		await vi.advanceTimersByTimeAsync(0);

		expect(copyImage).toHaveBeenCalledWith('/vwap-maxxer.png');
		expect(root.querySelector('#toast')?.textContent).toBe('');
		expect(root.querySelector('#toast')?.classList).not.toContain('toast--visible');
		expect(copyButton?.classList).toContain('copy-button--copied');
		expect(copyButton?.getAttribute('aria-label')).toBe('Copied');

		await vi.advanceTimersByTimeAsync(1800);

		expect(copyButton?.classList).not.toContain('copy-button--copied');
		expect(copyButton?.getAttribute('aria-label')).toBe('Copy link for VWAP Maxxer');
		vi.useRealTimers();

		stop();
	});

	it('shows an error when the copy strategy fails', async () => {
		const { root, stop } = startBrowser({
			copyImage: async () => {
				throw new Error('denied');
			}
		});

		root.querySelector<HTMLButtonElement>('[data-copy]')?.click();

		await vi.waitFor(() =>
			expect(root.querySelector('#toast')?.textContent).toContain("Couldn't copy the link")
		);
		expect(root.querySelector('#toast')?.classList).toContain('toast--error');

		stop();
	});
});
