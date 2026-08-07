import { describe, expect, it, vi } from 'vitest';

import { copyImageData } from '../image-copy-data';

describe('copyImageData', () => {
	it('returns false when clipboard image writing is unavailable', async () => {
		const copied = await copyImageData('/vwap-maxxer.png', {
			clipboardItem: undefined,
			fetchImage: async () => new Response(),
			navigator: { clipboard: undefined } as unknown as Navigator
		});

		expect(copied).toBe(false);
	});

	it('writes a validated png response to the clipboard', async () => {
		const copiedImages: Array<Promise<Blob>> = [];
		const write = vi.fn<(items: ClipboardItems) => Promise<void>>(async (items) => {
			copiedImages.push(items[0]?.getType('image/png') as Promise<Blob>);
		});
		const ClipboardItemStub = class {
			constructor(readonly items: Record<string, Promise<Blob>>) {}

			getType(type: string) {
				return this.items[type];
			}
		};

		const copied = await copyImageData('/vwap-maxxer.png', {
			clipboardItem: ClipboardItemStub as unknown as typeof ClipboardItem,
			fetchImage: async () =>
				({
					blob: async () => new Blob(['image'], { type: 'image/png' }),
					ok: true,
					status: 200
				}) as Response,
			navigator: { clipboard: { write } } as unknown as Navigator
		});

		expect(copied).toBe(true);
		expect(write).toHaveBeenCalledTimes(1);
		await expect(copiedImages[0]).resolves.toMatchObject({ type: 'image/png' });
	});

	it('rejects failed image responses', async () => {
		const write = vi.fn<(items: ClipboardItems) => Promise<void>>(async () => undefined);
		const ClipboardItemStub = class {
			constructor(readonly items: Record<string, Promise<Blob>>) {}
		};

		await expect(
			copyImageData('/missing.png', {
				clipboardItem: ClipboardItemStub as unknown as typeof ClipboardItem,
				fetchImage: async () => ({ ok: false, status: 404 }) as Response,
				navigator: { clipboard: { write } } as unknown as Navigator
			})
		).rejects.toThrow('Image request failed with status 404.');
	});

	it('rejects successful non-png responses', async () => {
		const write = vi.fn<(items: ClipboardItems) => Promise<void>>(async () => undefined);
		const ClipboardItemStub = class {
			constructor(readonly items: Record<string, Promise<Blob>>) {}
		};

		await expect(
			copyImageData('/vwap-maxxer.png', {
				clipboardItem: ClipboardItemStub as unknown as typeof ClipboardItem,
				fetchImage: async () =>
					({
						blob: async () => new Blob(['text']),
						ok: true,
						status: 200
					}) as Response,
				navigator: { clipboard: { write } } as unknown as Navigator
			})
		).rejects.toThrow('Expected a PNG response');
	});
});
