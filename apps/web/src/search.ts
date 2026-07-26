import type { Meme } from './meme-registry';

const normalize = (value: string) => value.trim().toLowerCase();

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

export const filterMemesByTag = (memes: readonly Meme[], tag: string) => {
	const normalizedTag = normalize(tag);

	return memes.filter((meme) =>
		meme.tags.some((candidate) => normalize(candidate) === normalizedTag)
	);
};
