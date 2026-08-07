import { describe, expect, it, vi } from 'vitest';

import { copyImageLink } from '../image-copy-link';

describe('copyImageLink', () => {
	it('returns false when clipboard text writing is unavailable', async () => {
		const copied = await copyImageLink('/vwap-maxxer.png', {
			document,
			navigator: { clipboard: undefined } as unknown as Navigator
		});

		expect(copied).toBe(false);
	});

	it('returns false when the document has no browsing origin', async () => {
		const writeText = vi.fn<(text: string) => Promise<void>>(async () => undefined);
		const detached = document.implementation.createHTMLDocument();

		const copied = await copyImageLink('/vwap-maxxer.png', {
			document: detached,
			navigator: { clipboard: { writeText } } as unknown as Navigator
		});

		expect(copied).toBe(false);
		expect(writeText).not.toHaveBeenCalled();
	});

	it('writes the absolute image url to the clipboard', async () => {
		const writeText = vi.fn<(text: string) => Promise<void>>(async () => undefined);
		const expectedUrl = new URL('/vwap-maxxer.png', window.location.origin).href;

		const copied = await copyImageLink('/vwap-maxxer.png', {
			document,
			navigator: { clipboard: { writeText } } as unknown as Navigator
		});

		expect(copied).toBe(true);
		expect(writeText).toHaveBeenCalledWith(expectedUrl);
	});
});
