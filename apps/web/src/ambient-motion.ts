const CYCLE_DURATION_MS = 7_500;

export type AmbientFrame = {
	readonly accent: {
		readonly radius: number;
		readonly x: number;
		readonly y: number;
	};
	readonly spotlight: {
		readonly radius: number;
		readonly x: number;
		readonly y: number;
	};
};

export const getAmbientFrame = (width: number, height: number, time: number): AmbientFrame => {
	const angle = (time / CYCLE_DURATION_MS) * Math.PI * 2;
	const largestSide = Math.max(width, height);

	return {
		accent: {
			radius: largestSide * 0.32,
			x: width * (0.5 + Math.cos(angle * 1.35 + 1.2) * 0.43),
			y: height * (0.5 + Math.sin(angle * 0.82 + 2.4) * 0.36)
		},
		spotlight: {
			radius: largestSide * (0.48 + Math.sin(angle * 1.5) * 0.08),
			x: width * (0.5 + Math.sin(angle) * 0.38),
			y: height * (0.48 + Math.sin(angle * 2) * 0.3)
		}
	};
};
