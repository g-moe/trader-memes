import { defineConfig } from '@playwright/test';

export default defineConfig({
	forbidOnly: Boolean(process.env.CI),
	fullyParallel: true,
	retries: process.env.CI ? 2 : 0,
	testDir: '.',
	testMatch: '**/*.e2e.test.ts',
	use: {
		browserName: 'chromium',
		trace: 'on-first-retry'
	},
	workers: process.env.CI ? 1 : undefined
});
