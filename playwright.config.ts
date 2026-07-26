import { defineConfig } from '@playwright/test';

export default defineConfig({
	expect: {
		timeout: 5_000
	},
	forbidOnly: Boolean(process.env.CI),
	fullyParallel: true,
	retries: process.env.CI ? 2 : 0,
	testDir: '.',
	testMatch: '**/*.e2e.test.ts',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		browserName: 'chromium',
		trace: 'on-first-retry'
	},
	webServer: {
		command:
			'pnpm --filter @trader-memes/web build && pnpm --filter @trader-memes/web preview --host 127.0.0.1',
		reuseExistingServer: !process.env.CI,
		url: 'http://127.0.0.1:4173'
	},
	workers: process.env.CI ? 1 : undefined
});
