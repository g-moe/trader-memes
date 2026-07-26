import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			exclude: ['src/main.ts'],
			include: ['src/**/*.ts'],
			provider: 'v8',
			thresholds: {
				branches: 90,
				functions: 90,
				lines: 90,
				statements: 90
			}
		},
		projects: [
			{
				extends: true,
				test: {
					environment: 'node',
					include: ['**/*.node.test.ts'],
					name: 'node'
				}
			},
			{
				extends: true,
				test: {
					environment: 'jsdom',
					include: ['**/*.jsdom.test.ts'],
					name: 'jsdom'
				}
			}
		]
	}
});
