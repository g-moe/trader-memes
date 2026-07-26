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
		clipboardItem: undefined,
		document,
		fetchImage: (path: string) => fetch(path),
		navigator,
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
				clipboardItem: undefined,
				document,
				fetchImage: (path) => fetch(path),
				navigator
			})
		).toThrow('Required meme browser element not found: #meme-search');
	});

	it('renders accessible controls and filters free-text searches', () => {
		const { root, stop } = startBrowser();
		const search = root.querySelector<HTMLInputElement>('#meme-search');

		expect(root.querySelector('h1')?.textContent).toBe('Trader Memes');
		expect(root.querySelectorAll('.meme-card')).toHaveLength(2);
		expect(root.querySelector('[data-copy]')?.getAttribute('aria-label')).toBe('Copy VWAP Maxxer');

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

	it('downloads when clipboard images are unavailable', async () => {
		const click = vi
			.spyOn(HTMLAnchorElement.prototype, 'click')
			.mockImplementation(() => undefined);
		const { root, stop } = startBrowser();

		root.querySelector<HTMLButtonElement>('[data-copy]')?.click();

		await vi.waitFor(() => expect(click).toHaveBeenCalledTimes(1));
		expect(root.querySelector('#toast')?.textContent).toContain("Copy isn't supported");
		expect(root.querySelector('#toast')?.classList).toContain('toast--error');

		stop();
	});

	it('copies validated image responses and falls back for invalid responses', async () => {
		const copiedImages: Array<Promise<Blob>> = [];
		const write = vi.fn<(items: ClipboardItems) => Promise<void>>(async (items) => {
			copiedImages.push(items[0]?.getType('image/png') as Promise<Blob>);
		});
		const click = vi
			.spyOn(HTMLAnchorElement.prototype, 'click')
			.mockImplementation(() => undefined);
		const ClipboardItemStub = class {
			constructor(readonly items: Record<string, Promise<Blob>>) {}

			getType(type: string) {
				return this.items[type];
			}
		};
		const successfulFetch = vi.fn<() => Promise<Response>>(
			async () =>
				({
					blob: async () => new Blob(['image'], { type: 'image/png' }),
					ok: true,
					status: 200
				}) as Response
		);
		const navigatorWithClipboard = { clipboard: { write } } as unknown as Navigator;
		const { root, stop } = startBrowser({
			clipboardItem: ClipboardItemStub as unknown as typeof ClipboardItem,
			fetchImage: successfulFetch,
			navigator: navigatorWithClipboard
		});
		const copyButton = root.querySelector<HTMLButtonElement>('[data-copy]');

		vi.useFakeTimers();
		copyButton?.click();

		expect(write).toHaveBeenCalledTimes(1);
		await vi.advanceTimersByTimeAsync(0);
		await expect(copiedImages[0]).resolves.toMatchObject({ type: 'image/png' });
		expect(root.querySelector('#toast')?.textContent).toBe('');
		expect(root.querySelector('#toast')?.classList).not.toContain('toast--visible');
		expect(copyButton?.classList).toContain('copy-button--copied');
		expect(copyButton?.getAttribute('aria-label')).toBe('Copied');

		await vi.advanceTimersByTimeAsync(900);
		copyButton?.click();
		await vi.advanceTimersByTimeAsync(900);

		expect(write).toHaveBeenCalledTimes(2);
		expect(copyButton?.classList).toContain('copy-button--copied');

		await vi.advanceTimersByTimeAsync(900);

		expect(copyButton?.classList).not.toContain('copy-button--copied');
		expect(copyButton?.getAttribute('aria-label')).toBe('Copy VWAP Maxxer');
		vi.useRealTimers();

		successfulFetch.mockResolvedValueOnce({ ok: false, status: 404 } as Response);
		copyButton?.click();

		await vi.waitFor(() => expect(click).toHaveBeenCalledTimes(1));
		expect(root.querySelector('#toast')?.textContent).toContain("Couldn't copy");
		expect(root.querySelector('#toast')?.classList).toContain('toast--error');

		stop();
	});

	it('rejects successful non-image responses', async () => {
		const click = vi
			.spyOn(HTMLAnchorElement.prototype, 'click')
			.mockImplementation(() => undefined);
		const ClipboardItemStub = class {
			constructor(readonly items: Record<string, Blob>) {}
		};
		const nonImageFetch = vi.fn<() => Promise<Response>>(
			async () =>
				({
					blob: async () => new Blob(['text']),
					ok: true,
					status: 200
				}) as Response
		);
		const navigatorWithClipboard = {
			clipboard: {
				write: vi.fn<(items: ClipboardItems) => Promise<void>>(async () => undefined)
			}
		} as unknown as Navigator;
		const { root, stop } = startBrowser({
			clipboardItem: ClipboardItemStub as unknown as typeof ClipboardItem,
			fetchImage: nonImageFetch,
			navigator: navigatorWithClipboard
		});

		root.querySelector<HTMLButtonElement>('[data-copy]')?.click();

		await vi.waitFor(() => expect(click).toHaveBeenCalledTimes(1));
		expect(root.querySelector('#toast')?.textContent).toContain("Couldn't copy");
		expect(root.querySelector('#toast')?.classList).toContain('toast--error');

		stop();
	});
});
