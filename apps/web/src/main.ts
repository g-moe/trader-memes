import './styles.css';
import type { Meme } from './meme-registry';

import { startAmbientBackground } from './ambient-background';
import { MEMES } from './meme-registry';
import { filterMemes } from './search';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
	throw new Error('App root not found.');
}

const stopAmbientBackground = startAmbientBackground();
window.addEventListener('pagehide', stopAmbientBackground, { once: true });

const MEME_LIST = Object.values(MEMES);

const renderCard = (meme: Meme) => `
	<article class="meme-card">
		<div class="meme-card__image-wrap">
			<img class="meme-card__image" src="${meme.path}" alt="${meme.title}" loading="lazy" />
			<button class="copy-button" type="button" data-copy="${meme.path}">
				<span aria-hidden="true">⧉</span> Copy image
			</button>
		</div>
		<div class="meme-card__body">
			<h2>${meme.title}</h2>
			<div class="tags" aria-label="Tags">
				${meme.tags.map((tag) => `<button type="button" data-tag="${tag}">#${tag}</button>`).join('')}
			</div>
		</div>
	</article>
`;

app.innerHTML = `
	<header class="site-header">
		<a class="brand" href="/" aria-label="Trader Memes home">
			<span class="brand__mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
			<span>TRADER <b>MEMES</b></span>
		</a>
		<label class="search">
			<span aria-hidden="true">⌕</span>
			<span class="sr-only">Search memes by name or tag</span>
			<input id="meme-search" type="search" placeholder="Search" autocomplete="off" />
		</label>
	</header>

	<main>
		<section class="browser" aria-label="Meme results">
			<div id="meme-grid" class="meme-grid" aria-live="polite"></div>
			<div id="empty-state" class="empty-state" hidden>
				<span aria-hidden="true">↘</span>
				<h2>Stopped out.</h2>
				<p>No memes match that trade. Try a broader search.</p>
				<button type="button" data-clear>Clear search</button>
			</div>
		</section>
	</main>

	<footer>
		<p><span>TRADER MEMES</span> — Losses temporary. Memes forever.</p>
	</footer>

	<div id="toast" class="toast" role="status" aria-live="polite"></div>
`;

const searchInput = document.querySelector<HTMLInputElement>('#meme-search');
const memeGrid = document.querySelector<HTMLDivElement>('#meme-grid');
const emptyState = document.querySelector<HTMLElement>('#empty-state');
const toast = document.querySelector<HTMLElement>('#toast');

if (!searchInput || !memeGrid || !emptyState || !toast) {
	throw new Error('Meme browser controls not found.');
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

const showToast = (message: string) => {
	toast.textContent = message;
	toast.classList.add('toast--visible');

	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 2600);
};

const renderMemes = (query: string) => {
	const matches = filterMemes(MEME_LIST, query);

	memeGrid.innerHTML = matches.map(renderCard).join('');
	emptyState.hidden = matches.length > 0;
};

const downloadImage = (path: string) => {
	const link = document.createElement('a');

	link.href = path;
	link.download = path.split('/').at(-1) ?? 'trader-meme.png';
	link.click();
};

const copyImage = async (path: string) => {
	try {
		if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
			throw new Error('Image clipboard unavailable.');
		}

		const response = await fetch(path);
		const blob = await response.blob();

		await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
		showToast('Copied. Go save the group chat.');
	} catch {
		downloadImage(path);
		showToast("Copy isn't supported here, so we downloaded it.");
	}
};

const setSearch = (query: string) => {
	searchInput.value = query;
	renderMemes(query);
	searchInput.focus();
};

searchInput.addEventListener('input', () => renderMemes(searchInput.value));

document.addEventListener('click', (event) => {
	const target = event.target;

	if (!(target instanceof Element)) {
		return;
	}

	const copyButton = target.closest<HTMLButtonElement>('[data-copy]');
	const tagButton = target.closest<HTMLButtonElement>('[data-tag]');

	if (copyButton?.dataset.copy) {
		void copyImage(copyButton.dataset.copy);
	}

	if (tagButton?.dataset.tag) {
		setSearch(tagButton.dataset.tag);
	}

	if (target.closest('[data-clear]')) {
		setSearch('');
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === '/' && document.activeElement !== searchInput) {
		event.preventDefault();
		searchInput.focus();
	}

	if (event.key === 'Escape' && document.activeElement === searchInput) {
		setSearch('');
	}
});

renderMemes('');
