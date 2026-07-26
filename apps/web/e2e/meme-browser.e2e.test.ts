import { expect, test } from '@playwright/test';

test('searches, browses exact tags, and clears an empty result with Escape', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { level: 1, name: 'Trader Memes' })).toBeAttached();
	await expect(page.getByRole('article')).toHaveCount(50);

	const search = page.getByRole('searchbox', { name: 'Search memes by name or tag' });
	await search.fill('got any vwap');

	await expect(page.getByRole('heading', { level: 2, name: 'Got Any VWAP?' })).toBeVisible();
	await expect(page.getByRole('status').filter({ hasText: '1 meme found.' })).toBeAttached();

	await search.fill('VWAP Chad');
	const vwapChad = page
		.getByRole('article')
		.filter({ has: page.getByRole('heading', { level: 2, name: 'VWAP Chad' }) });
	await vwapChad.getByRole('button', { name: '#ict' }).click();

	await expect(page.getByRole('article')).toHaveCount(3);
	await expect(page.getByRole('heading', { level: 2, name: 'C.O.B.D GANG' })).toHaveCount(0);

	await search.fill('not-a-real-meme');
	await expect(page.getByRole('heading', { level: 2, name: 'Stopped out.' })).toBeVisible();
	await search.press('Escape');

	await expect(page.getByRole('article')).toHaveCount(50);
	await expect(search).toBeFocused();
});
