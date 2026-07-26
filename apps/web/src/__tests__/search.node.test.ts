import type { Meme } from '../meme-registry';

import { describe, expect, it } from 'vitest';

import { filterMemes, filterMemesByTag } from '../search';

const MEMES = [
	{ filename: 'vwap.png', tags: ['vwap'], title: 'VWAP.' },
	{
		filename: 'self-sabotage.png',
		tags: ['short', 'short-hole', 'short-low', 'ss'],
		title: 'Self Sabotage'
	}
] as const satisfies readonly Meme[];

describe('filterMemes', () => {
	it('returns every meme for a blank query', () => {
		expect(filterMemes(MEMES, '   ')).toBe(MEMES);
	});

	it('matches names and tags without caring about case', () => {
		expect(filterMemes(MEMES, 'VWAP')).toEqual([MEMES[0]]);
		expect(filterMemes(MEMES, 'short-hole')).toEqual([MEMES[1]]);
		expect(filterMemes(MEMES, 'SHORT-HOLE')).toEqual([MEMES[1]]);
	});

	it('requires every search term to match', () => {
		expect(filterMemes(MEMES, 'short ss')).toEqual([MEMES[1]]);
		expect(filterMemes(MEMES, 'short vwap')).toEqual([]);
	});

	it('matches selected tags exactly', () => {
		const collision = {
			filename: 'short-hole-only.png',
			tags: ['short-hole'],
			title: 'Short Hole Only'
		} as const satisfies Meme;

		expect(filterMemesByTag([...MEMES, collision], 'short')).toEqual([MEMES[1]]);
		expect(filterMemesByTag([...MEMES, collision], 'ict')).toEqual([]);
	});
});
