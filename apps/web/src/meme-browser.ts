import type { Meme } from './meme-registry';

import { filterMemes, filterMemesByTag } from './search';

type BrowserDependencies = {
	readonly clipboardItem?: typeof ClipboardItem;
	readonly document: Document;
	readonly fetchImage: (path: string) => Promise<Response>;
	readonly navigator: Navigator;
};

type ToastTone = 'default' | 'error';

type CopySuccessState = {
	readonly ariaLabel: string | null;
	readonly timer: ReturnType<typeof setTimeout>;
};

const COPY_SUCCESS_DURATION_MS = 1800;

const renderCard = (meme: Meme) => {
	const imagePath = `/${meme.filename}`;

	return `
	<article class="meme-card">
		<div class="meme-card__image-wrap">
			<img class="meme-card__image" src="${imagePath}" alt="${meme.title}" loading="lazy" />
			<button class="copy-button" type="button" data-copy="${imagePath}" aria-label="Copy ${meme.title}">
				<span aria-hidden="true">⧉</span>
				<span class="copy-button__label" aria-hidden="true">
					<span class="copy-button__label-track">
						<span>Copy image</span>
						<span>Copied</span>
					</span>
				</span>
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
};

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
				<span class="empty-state__mark" aria-hidden="true">×</span>
				<h2>Stopped out.</h2>
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
	dependencies: Pick<BrowserDependencies, 'clipboardItem' | 'fetchImage' | 'navigator'>
) => {
	if (!dependencies.navigator.clipboard?.write || !dependencies.clipboardItem) {
		return false;
	}

	const image = dependencies.fetchImage(path).then(async (response) => {
		if (!response.ok) {
			throw new Error(`Image request failed with status ${response.status}.`);
		}

		const blob = await response.blob();

		if (blob.type !== 'image/png') {
			throw new Error(`Expected a PNG response, received ${blob.type || 'an unknown type'}.`);
		}

		return blob;
	});
	const write = dependencies.navigator.clipboard.write([
		new dependencies.clipboardItem({ 'image/png': image })
	]);

	await Promise.all([image, write]);

	return true;
};

const getRequiredElement = <ElementType extends Element>(
	root: ParentNode,
	selector: string
): ElementType => {
	const element = root.querySelector<ElementType>(selector);

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
	const copySuccessStates = new Map<HTMLButtonElement, CopySuccessState>();
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	const showToast = (message: string, tone: ToastTone = 'default') => {
		toast.textContent = message;
		toast.classList.toggle('toast--error', tone === 'error');
		toast.classList.add('toast--visible');

		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 2600);
	};
	const handleCopyFailure = (path: string, message: string) => {
		downloadImage(dependencies.document, path);
		showToast(message, 'error');
	};
	const showCopySuccess = (button: HTMLButtonElement) => {
		const currentState = copySuccessStates.get(button);
		const ariaLabel = currentState?.ariaLabel ?? button.getAttribute('aria-label');

		button.classList.add('copy-button--copied');
		button.setAttribute('aria-label', 'Copied');
		clearTimeout(currentState?.timer);

		const timer = setTimeout(() => {
			button.classList.remove('copy-button--copied');

			if (ariaLabel) {
				button.setAttribute('aria-label', ariaLabel);
			} else {
				button.removeAttribute('aria-label');
			}

			copySuccessStates.delete(button);
		}, COPY_SUCCESS_DURATION_MS);

		copySuccessStates.set(button, { ariaLabel, timer });
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

	const copyImage = async (path: string, onSuccess: () => void) => {
		let copied: boolean;

		try {
			copied = await writeImageToClipboard(path, dependencies);
		} catch (error) {
			console.error('Image copy failed.', error);
			handleCopyFailure(path, "Couldn't copy the image, so we downloaded it.");
			return;
		}

		if (!copied) {
			handleCopyFailure(path, "Copy isn't supported here, so we downloaded it.");
			return;
		}

		onSuccess();
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
			void copyImage(copyButton.dataset.copy, () => showCopySuccess(copyButton));
			return;
		}

		if (tagButton?.dataset.tag) {
			setSearch(tagButton.dataset.tag, tagButton.dataset.tag);
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
		copySuccessStates.forEach(({ timer }) => clearTimeout(timer));
		copySuccessStates.clear();
		searchInput.removeEventListener('input', handleInput);
		dependencies.document.removeEventListener('click', handleClick);
		dependencies.document.removeEventListener('keydown', handleKeydown);
	};
};
