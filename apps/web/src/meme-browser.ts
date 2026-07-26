import type { Meme } from './meme-registry';

import { filterMemes, filterMemesByTag } from './search';

type BrowserDependencies = {
	readonly clipboardItem?: typeof ClipboardItem;
	readonly document: Document;
	readonly fetch: typeof fetch;
	readonly navigator: Navigator;
};

const renderCard = (meme: Meme) => `
	<article class="meme-card">
		<div class="meme-card__image-wrap">
			<img class="meme-card__image" src="${meme.path}" alt="${meme.title}" loading="lazy" />
			<button class="copy-button" type="button" data-copy="${meme.path}" aria-label="Copy ${meme.title}">
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

const renderShell = () => `
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
		<h1 class="sr-only">Trader Memes</h1>
		<section class="browser" aria-label="Meme results">
			<p id="result-status" class="sr-only" role="status" aria-live="polite"></p>
			<div id="meme-grid" class="meme-grid"></div>
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

const downloadImage = (document: Document, path: string) => {
	const link = document.createElement('a');

	link.href = path;
	link.download = path.split('/').at(-1) ?? 'trader-meme.png';
	link.click();
};

const writeImageToClipboard = async (
	path: string,
	dependencies: Pick<BrowserDependencies, 'clipboardItem' | 'fetch' | 'navigator'>
) => {
	if (!dependencies.navigator.clipboard?.write || !dependencies.clipboardItem) {
		return false;
	}

	const response = await dependencies.fetch(path);

	if (!response.ok) {
		throw new Error(`Image request failed with status ${response.status}.`);
	}

	const blob = await response.blob();

	if (!blob.type.startsWith('image/')) {
		throw new Error(`Expected an image response, received ${blob.type || 'an unknown type'}.`);
	}

	await dependencies.navigator.clipboard.write([
		new dependencies.clipboardItem({ [blob.type]: blob })
	]);

	return true;
};

const getRequiredElement = <ElementType extends Element>(
	document: Document,
	selector: string
): ElementType => {
	const element = document.querySelector<ElementType>(selector);

	if (!element) {
		throw new Error(`Required meme browser element not found: ${selector}`);
	}

	return element;
};

export const startMemeBrowser = (
	root: HTMLDivElement,
	memes: readonly Meme[],
	dependencies: BrowserDependencies
) => {
	root.innerHTML = renderShell();

	const searchInput = getRequiredElement<HTMLInputElement>(dependencies.document, '#meme-search');
	const memeGrid = getRequiredElement<HTMLDivElement>(dependencies.document, '#meme-grid');
	const emptyState = getRequiredElement<HTMLElement>(dependencies.document, '#empty-state');
	const resultStatus = getRequiredElement<HTMLElement>(dependencies.document, '#result-status');
	const toast = getRequiredElement<HTMLElement>(dependencies.document, '#toast');
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	const showToast = (message: string) => {
		toast.textContent = message;
		toast.classList.add('toast--visible');

		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 2600);
	};

	const renderMemes = (query: string, exactTag?: string) => {
		const matches = exactTag ? filterMemesByTag(memes, exactTag) : filterMemes(memes, query);

		memeGrid.innerHTML = matches.map(renderCard).join('');
		emptyState.hidden = matches.length > 0;
		resultStatus.textContent =
			matches.length === 0
				? 'No memes found.'
				: `${matches.length} meme${matches.length === 1 ? '' : 's'} found.`;
	};

	const copyImage = async (path: string) => {
		try {
			const copied = await writeImageToClipboard(path, dependencies);

			if (copied) {
				showToast('Copied. Go save the group chat.');
				return;
			}

			downloadImage(dependencies.document, path);
			showToast("Copy isn't supported here, so we downloaded it.");
		} catch {
			downloadImage(dependencies.document, path);
			showToast("Couldn't copy the image, so we downloaded it.");
		}
	};

	const setSearch = (query: string, exactTag?: string) => {
		searchInput.value = query;
		renderMemes(query, exactTag);
		searchInput.focus();
	};

	const handleInput = () => renderMemes(searchInput.value);
	const handleClick = (event: Event) => {
		const target = event.target;
		const ElementConstructor = dependencies.document.defaultView?.Element;

		if (!ElementConstructor || !(target instanceof ElementConstructor)) {
			return;
		}

		const element = target as Element;
		const copyButton = element.closest<HTMLButtonElement>('[data-copy]');
		const tagButton = element.closest<HTMLButtonElement>('[data-tag]');

		if (copyButton?.dataset.copy) {
			void copyImage(copyButton.dataset.copy);
			return;
		}

		if (tagButton?.dataset.tag) {
			setSearch(tagButton.dataset.tag, tagButton.dataset.tag);
			return;
		}

		if (element.closest('[data-clear]')) {
			setSearch('');
		}
	};
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && dependencies.document.activeElement === searchInput) {
			setSearch('');
		}
	};

	searchInput.addEventListener('input', handleInput);
	dependencies.document.addEventListener('click', handleClick);
	dependencies.document.addEventListener('keydown', handleKeydown);
	renderMemes('');

	return () => {
		clearTimeout(toastTimer);
		searchInput.removeEventListener('input', handleInput);
		dependencies.document.removeEventListener('click', handleClick);
		dependencies.document.removeEventListener('keydown', handleKeydown);
	};
};
