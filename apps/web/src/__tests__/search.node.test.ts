import type { Meme } from '../meme-registry';

import { describe, expect, it } from 'vitest';

import { filterMemes } from '../search';

const MEMES = [
	{ path: '/vwap-elmo-fire.png', tags: ['vwap', 'elmo'], title: 'VWAP Is Lit' },
	{
		path: '/stop-fading-trend-days.png',
		tags: ['trend-day', 'discipline'],
		title: 'Did You Fade It?'
	}
] as const satisfies readonly Meme[];

describe('filterMemes', () => {
	it('returns every meme for a blank query', () => {
		expect(filterMemes(MEMES, '   ')).toBe(MEMES);
	});

	it('matches names and tags without caring about case', () => {
		expect(filterMemes(MEMES, 'VWAP')).toEqual([MEMES[0]]);
		expect(filterMemes(MEMES, 'discipline')).toEqual([MEMES[1]]);
	});

	it('requires every search term to match', () => {
		expect(filterMemes(MEMES, 'trend discipline')).toEqual([MEMES[1]]);
		expect(filterMemes(MEMES, 'trend elmo')).toEqual([]);
	});
});
