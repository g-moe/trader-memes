import { expect, test } from '@playwright/test';

test('searches, browses exact tags, and clears an empty result', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { level: 1, name: 'Trader Memes' })).toBeAttached();
	await expect(page.getByRole('article')).toHaveCount(75);

	const search = page.getByRole('searchbox', { name: 'Search memes by name or tag' });
	await search.fill('vwap elmo');

	await expect(page.getByRole('heading', { level: 2, name: 'VWAP Is Lit' })).toBeVisible();
	await expect(page.getByRole('status').filter({ hasText: '1 meme found.' })).toBeAttached();

	await search.fill('VWAP Chad');
	const vwapChad = page
		.getByRole('article')
		.filter({ has: page.getByRole('heading', { level: 2, name: 'VWAP Chad' }) });
	await vwapChad.getByRole('button', { name: '#ict' }).click();

	await expect(page.getByRole('article')).toHaveCount(2);
	await expect(page.getByRole('heading', { level: 2, name: 'Conviction Meme' })).toHaveCount(0);

	await search.fill('not-a-real-meme');
	await expect(page.getByText('No memes match that trade.')).toBeVisible();
	await page.getByRole('button', { name: 'Clear search' }).click();

	await expect(page.getByRole('article')).toHaveCount(75);
	await expect(search).toBeFocused();
});
