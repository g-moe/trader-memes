import { afterEach, describe, expect, it, vi } from 'vitest';

import { startAmbientBackground } from '../ambient-background';

const createContext = () => {
	const gradient = {
		addColorStop: vi.fn<(offset: number, color: string) => void>()
	} as unknown as CanvasGradient;
	const fillRect = vi.fn<(x: number, y: number, width: number, height: number) => void>();

	return {
		context: {
			createLinearGradient: vi.fn<() => CanvasGradient>(() => gradient),
			createRadialGradient: vi.fn<() => CanvasGradient>(() => gradient),
			fillRect,
			setTransform: vi.fn<() => void>()
		} as unknown as CanvasRenderingContext2D,
		fillRect
	};
};

const installMotionPreference = (matches: boolean) => {
	const listeners = new Set<() => void>();
	const preference = {
		addEventListener: vi.fn<(event: string, listener: () => void) => void>(
			(_event, listener) => void listeners.add(listener)
		),
		matches,
		removeEventListener: vi.fn<(event: string, listener: () => void) => void>(
			(_event, listener) => void listeners.delete(listener)
		)
	};

	vi.stubGlobal(
		'matchMedia',
		vi.fn<() => typeof preference>(() => preference)
	);

	return {
		change(nextMatches: boolean) {
			preference.matches = nextMatches;
			listeners.forEach((listener) => listener());
		},
		preference
	};
};

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	document.body.innerHTML = '';
});

describe('startAmbientBackground', () => {
	it('does nothing when canvas rendering is unavailable', () => {
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

		const stop = startAmbientBackground();

		expect(document.querySelector('canvas')).toBeNull();
		expect(stop()).toBeUndefined();
	});

	it('draws a still frame for reduced motion and responds to preference changes', () => {
		const { context, fillRect } = createContext();
		const motion = installMotionPreference(true);
		const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(7);
		const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);

		const stop = startAmbientBackground();
		const canvas = document.querySelector('canvas');

		expect(canvas?.className).toBe('ambient-background');
		expect(fillRect).toHaveBeenCalled();
		expect(requestAnimationFrame).not.toHaveBeenCalled();

		window.dispatchEvent(new Event('resize'));
		expect(fillRect).toHaveBeenCalledTimes(6);

		motion.change(false);
		expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

		motion.change(true);
		expect(cancelAnimationFrame).toHaveBeenCalledWith(7);

		stop();
		expect(canvas?.isConnected).toBe(false);
		expect(motion.preference.removeEventListener).toHaveBeenCalledWith(
			'change',
			expect.any(Function)
		);
	});

	it('pauses animation while hidden and resumes when visible', () => {
		const { context, fillRect } = createContext();
		installMotionPreference(false);
		let frameCallback: FrameRequestCallback | undefined;
		const requestAnimationFrame = vi
			.spyOn(window, 'requestAnimationFrame')
			.mockImplementation((callback) => {
				frameCallback = callback;
				return 11;
			});
		const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
		const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);

		const stop = startAmbientBackground();

		expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
		frameCallback?.(1_000);
		expect(fillRect).toHaveBeenCalledTimes(3);

		hidden.mockReturnValue(true);
		document.dispatchEvent(new Event('visibilitychange'));
		expect(cancelAnimationFrame).toHaveBeenCalled();

		hidden.mockReturnValue(false);
		document.dispatchEvent(new Event('visibilitychange'));
		expect(requestAnimationFrame).toHaveBeenCalledTimes(3);

		stop();
	});
});
