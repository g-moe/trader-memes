import { describe, expect, it } from 'vitest';

import { getAmbientFrame } from '../ambient-motion';

describe('getAmbientFrame', () => {
	it('starts from a stable position and scales radii to the larger viewport side', () => {
		const frame = getAmbientFrame(1_000, 600, 0);

		expect(frame.spotlight.x).toBe(500);
		expect(frame.spotlight.y).toBe(288);
		expect(frame.spotlight.radius).toBe(480);
		expect(frame.accent.radius).toBe(320);
	});

	it('loops the main spotlight cleanly while the accent keeps drifting', () => {
		const start = getAmbientFrame(1_000, 600, 0);
		const nextCycle = getAmbientFrame(1_000, 600, 7_500);

		expect(nextCycle.spotlight.x).toBeCloseTo(start.spotlight.x);
		expect(nextCycle.spotlight.y).toBeCloseTo(start.spotlight.y);
		expect(nextCycle.spotlight.radius).toBeCloseTo(start.spotlight.radius);
		expect(nextCycle.accent).not.toEqual(start.accent);
	});

	it('moves both lights during the cycle', () => {
		const start = getAmbientFrame(1_000, 600, 0);
		const later = getAmbientFrame(1_000, 600, 1_000);

		expect(later.spotlight.x).not.toBe(start.spotlight.x);
		expect(later.spotlight.y).not.toBe(start.spotlight.y);
		expect(later.accent.x).not.toBe(start.accent.x);
		expect(later.accent.y).not.toBe(start.accent.y);
	});
});
