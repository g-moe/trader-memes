import { readdirSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { MEMES, TAGS } from '../meme-registry';

const MEME_LIST = Object.values(MEMES);

describe('meme catalog', () => {
	it('gives every meme an explicit title', () => {
		expect(MEME_LIST).toHaveLength(75);
		expect(MEME_LIST.every((meme) => meme.title.trim().length > 0)).toBe(true);
	});

	it('defines every available tag once as a single searchable token', () => {
		expect(new Set(TAGS).size).toBe(TAGS.length);
		expect(TAGS.every((tag) => !/\s/.test(tag))).toBe(true);
	});

	it('keeps registry keys, paths, and committed image files in exact parity', () => {
		const entries = Object.entries(MEMES);
		const paths = entries.map(([, meme]) => meme.path);
		const imageFiles = readdirSync(new URL('../../../../images/', import.meta.url))
			.filter((file) => file.endsWith('.png'))
			.sort();

		expect(new Set(paths).size).toBe(paths.length);
		expect(entries.every(([key, meme]) => meme.path === `/${key}.png`)).toBe(true);
		expect(paths.map((path) => path.slice(1)).sort()).toEqual(imageFiles);
	});
});
