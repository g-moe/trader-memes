export type ImageCopyDataDependencies = {
	readonly clipboardItem?: typeof ClipboardItem;
	readonly fetchImage: (path: string) => Promise<Response>;
	readonly navigator: Navigator;
};

export const copyImageData = async (
	path: string,
	dependencies: ImageCopyDataDependencies
): Promise<boolean> => {
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
