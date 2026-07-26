import './styles.css';
import { startAmbientBackground } from './ambient-background';
import { startMemeBrowser } from './meme-browser';
import { MEMES } from './meme-registry';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
	throw new Error('App root not found.');
}

const MEME_LIST = Object.values(MEMES);
const stopMemeBrowser = startMemeBrowser(app, MEME_LIST, {
	clipboardItem: globalThis.ClipboardItem,
	document,
	fetchImage: (path) => fetch(path),
	navigator
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
