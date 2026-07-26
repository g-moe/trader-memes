import { getAmbientFrame } from './ambient-motion';

const MAX_PIXEL_RATIO = 2;

const sizeCanvas = (
	canvas: HTMLCanvasElement,
	context: CanvasRenderingContext2D,
	width: number,
	height: number
) => {
	const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
	const canvasWidth = Math.round(width * pixelRatio);
	const canvasHeight = Math.round(height * pixelRatio);

	if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
	}

	context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
};

const drawAmbientBackground = (
	canvas: HTMLCanvasElement,
	context: CanvasRenderingContext2D,
	time: number
) => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	const frame = getAmbientFrame(width, height, time);

	sizeCanvas(canvas, context, width, height);

	const base = context.createLinearGradient(0, 0, width, height);
	base.addColorStop(0, '#151a14');
	base.addColorStop(0.5, '#101310');
	base.addColorStop(1, '#090b09');
	context.fillStyle = base;
	context.fillRect(0, 0, width, height);

	const spotlight = context.createRadialGradient(
		frame.spotlight.x,
		frame.spotlight.y,
		0,
		frame.spotlight.x,
		frame.spotlight.y,
		frame.spotlight.radius
	);
	spotlight.addColorStop(0, 'rgba(105, 155, 60, 0.24)');
	spotlight.addColorStop(0.32, 'rgba(62, 91, 39, 0.14)');
	spotlight.addColorStop(1, 'rgba(16, 19, 16, 0)');
	context.fillStyle = spotlight;
	context.fillRect(0, 0, width, height);

	const accent = context.createRadialGradient(
		frame.accent.x,
		frame.accent.y,
		0,
		frame.accent.x,
		frame.accent.y,
		frame.accent.radius
	);
	accent.addColorStop(0, 'rgba(199, 255, 63, 0.12)');
	accent.addColorStop(0.4, 'rgba(83, 116, 48, 0.08)');
	accent.addColorStop(1, 'rgba(16, 19, 16, 0)');
	context.fillStyle = accent;
	context.fillRect(0, 0, width, height);
};

export const startAmbientBackground = () => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	if (!context) {
		return () => undefined;
	}

	canvas.className = 'ambient-background';
	canvas.setAttribute('aria-hidden', 'true');
	document.body.prepend(canvas);

	const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
	let animationFrame: number | undefined;

	const animate = (time: number) => {
		drawAmbientBackground(canvas, context, time);
		animationFrame = window.requestAnimationFrame(animate);
	};
	const drawStillFrame = () => drawAmbientBackground(canvas, context, 0);
	const stopAnimation = () => {
		if (animationFrame !== undefined) {
			window.cancelAnimationFrame(animationFrame);
		}

		animationFrame = undefined;
	};
	const startAnimation = () => {
		if (animationFrame === undefined && !document.hidden) {
			animationFrame = window.requestAnimationFrame(animate);
		}
	};
	const handleVisibilityChange = () => {
		if (document.hidden) {
			stopAnimation();
		} else if (!motionPreference.matches) {
			startAnimation();
		}
	};
	const handleMotionChange = () => {
		stopAnimation();
		window.removeEventListener('resize', drawStillFrame);

		if (motionPreference.matches) {
			drawStillFrame();
			window.addEventListener('resize', drawStillFrame);
		} else {
			startAnimation();
		}
	};

	motionPreference.addEventListener('change', handleMotionChange);
	document.addEventListener('visibilitychange', handleVisibilityChange);

	if (motionPreference.matches) {
		drawStillFrame();
		window.addEventListener('resize', drawStillFrame);
	} else {
		startAnimation();
	}

	return () => {
		stopAnimation();
		motionPreference.removeEventListener('change', handleMotionChange);
		window.removeEventListener('resize', drawStillFrame);
		document.removeEventListener('visibilitychange', handleVisibilityChange);
		canvas.remove();
	};
};
