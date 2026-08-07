import './styles.css';
import { startAmbientBackground } from './ambient-background';
import { copyImageData } from './image-copy-data';
import { copyImageLink } from './image-copy-link';
import { startMemeBrowser } from './meme-browser';
import { MEMES } from './meme-registry';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
	throw new Error('App root not found.');
}

const imageCopyStrategies = {
	data: (path: string) =>
		copyImageData(path, {
			clipboardItem: globalThis.ClipboardItem,
			fetchImage: (imagePath) => fetch(imagePath),
			navigator
		}),
	link: (path: string) =>
		copyImageLink(path, {
			document,
			navigator
		})
} as const;

const MEME_LIST = Object.values(MEMES);
const stopMemeBrowser = startMemeBrowser(app, MEME_LIST, {
	copyImage: imageCopyStrategies.link,
	document
});
let stopAmbientBackground: () => void = () => undefined;

try {
	stopAmbientBackground = startAmbientBackground();
} catch (error) {
	console.warn('Ambient background unavailable.', error);
}

const handlePageHide = (event: PageTransitionEvent) => {
	if (event.persisted) {
		return;
	}

	stopMemeBrowser();
	stopAmbientBackground();
	window.removeEventListener('pagehide', handlePageHide);
};

window.addEventListener('pagehide', handlePageHide);
