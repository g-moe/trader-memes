import { readdirSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { MEMES, TAGS } from '../meme-registry';

const MEME_LIST = Object.values(MEMES);

describe('meme catalog', () => {
	it('gives every meme an explicit title', () => {
		expect(MEME_LIST).toHaveLength(50);
		expect(MEME_LIST.every((meme) => meme.title.trim().length > 0)).toBe(true);
	});

	it('defines exactly the normalized tags used by the catalog', () => {
		const usedTags = [...new Set(MEME_LIST.flatMap((meme) => meme.tags))].sort();

		expect(new Set(TAGS).size).toBe(TAGS.length);
		expect(TAGS.every((tag) => !/\s/.test(tag))).toBe(true);
		expect(usedTags).toEqual([...TAGS].sort());
		expect(MEME_LIST.every((meme) => new Set(meme.tags).size === meme.tags.length)).toBe(true);
	});

	it('keeps registry keys, filenames, and committed image files in exact parity', () => {
		const entries = Object.entries(MEMES);
		const filenames = entries.map(([, meme]) => meme.filename);
		const imageFiles = readdirSync(new URL('../../../../images/', import.meta.url))
			.filter((file) => file.endsWith('.png'))
			.sort();

		expect(imageFiles).toHaveLength(50);
		expect(new Set(filenames).size).toBe(filenames.length);
		expect(new Set(MEME_LIST.map((meme) => meme.title)).size).toBe(MEME_LIST.length);
		expect(entries.every(([key, meme]) => meme.filename === `${key}.png`)).toBe(true);
		expect(filenames.sort()).toEqual(imageFiles);
	});

	it('adds the required aliases to every matching meme', () => {
		const hasTag = (meme: (typeof MEME_LIST)[number], tag: string) =>
			(meme.tags as readonly string[]).includes(tag);
		const missingVwap = MEME_LIST.filter(
			(meme) =>
				meme.title.toLowerCase().replaceAll(' ', '').includes('vwap') && !hasTag(meme, 'vwap')
		);
		const incompleteFtv = MEME_LIST.filter(
			(meme) =>
				meme.title.toLowerCase().includes('ftv') &&
				!['friday', 'ftv'].every((tag) => hasTag(meme, tag))
		);
		const incompleteShortHole = MEME_LIST.filter(
			(meme) =>
				hasTag(meme, 'short-hole') &&
				!['short', 'short-hole', 'short-low', 'ss'].every((tag) => hasTag(meme, tag))
		);
		const incompleteShortLow = MEME_LIST.filter(
			(meme) => hasTag(meme, 'short-low') && !['short', 'ss'].every((tag) => hasTag(meme, tag))
		);

		expect(missingVwap).toEqual([]);
		expect(incompleteFtv).toEqual([]);
		expect(incompleteShortHole).toEqual([]);
		expect(incompleteShortLow).toEqual([]);
	});
});
