import type { Meme } from './meme-registry';

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export const filterMemes = (memes: readonly Meme[], query: string) => {
	const terms = normalize(query).split(/\s+/).filter(Boolean);

	if (terms.length === 0) {
		return memes;
	}

	return memes.filter((meme) => {
		const searchableText = normalize(`${meme.title} ${meme.tags.join(' ')}`);

		return terms.every((term) => searchableText.includes(term));
	});
};
