export type ImageCopyLinkDependencies = {
	readonly document: Document;
	readonly navigator: Navigator;
};

const resolveAbsoluteImageUrl = (path: string, document: Document) => {
	const origin = document.defaultView?.location.origin;

	if (!origin) {
		return undefined;
	}

	return new URL(path, origin).href;
};

export const copyImageLink = async (
	path: string,
	dependencies: ImageCopyLinkDependencies
): Promise<boolean> => {
	const clipboard = dependencies.navigator.clipboard;

	if (!clipboard?.writeText) {
		return false;
	}

	const imageUrl = resolveAbsoluteImageUrl(path, dependencies.document);

	if (!imageUrl) {
		return false;
	}

	await clipboard.writeText(imageUrl);

	return true;
};
