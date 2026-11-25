import { test, expect } from '@playwright/test';


const url_route = '**/api/v1/fruits';
const url = 'https://demo.playwright.dev/api-mocking/';
const errorStatuses = [500, 400, 401, 403];

test.describe('Mocking: reference tests (basic concepts)', () =>{
    test('Test Mocking 1: Mock an API response with custom data', async ({ page }) => {
        const fruitOne = page.getByText('Playwright Peach');
        const fruitTwo = page.getByText('TypeScript Tangerine');

        await page.route(url_route, async (route) => {
            const fakeData = [
                {
                    name: 'Playwright Peach',
                    id: 99
                },
                {
                    name: 'TypeScript Tangerine',
                    id: 100
                }
            ];

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(fakeData),
            });
        });

        await page.goto(url);
        await expect(fruitOne).toBeVisible();
        await expect(fruitTwo).toBeVisible();
        await page.screenshot({ path: 'screeshots/mock-data-200.png', fullPage: true})
    });
    test('Test Mocking 2: simulate a 500 Server Error and capture a screenshot', async ({ page }) => {
        await page.route(url_route, async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal server error Andres Mock' }),
            });
        });

        await page.goto(url);
        await expect(page.getByText('Strawberry')).not.toBeVisible();
        await page.screenshot({ path: 'screeshots/server-error-500.png', fullPage: true});
    });
    test('Test Mocking 3: simulate a 400 error and capture screenshot', async ({ page }) => {
        await page.route(url_route, async (route) =>{
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Invalid parameters provided. Mock Andres!'})
            });
        });
        await page.goto(url);
        await expect(page.getByText('Strawberry')).not.toBeVisible();
        await page.screenshot({ path: 'screeshots/client-error-400.png', fullPage: true});
    });
    test('Test Mocking 4: simulate error 401 Unauthorized', async ({ page }) => {
        await page.route(url_route, async (route) => {
            await route.fulfill({
                status: 401,
                contentType: 'application/json',
                body: JSON.stringify({error: '401 Unauthorized | Invalid Authentication - Andres Mock'})
            });
        });
        await page.goto(url);
        await expect(page.getByText('Strawberry')).not.toBeVisible();
    });
    test('Test Mocking 5: simulate error 403 Forbidden', async ({ page }) => {
        await page.route(url_route, async (route) => {
            await route.fulfill({
                status: 403,
                json:{ error: '403 Forbidden | Andres Mock'}
            });
        });
        await page.goto(url);
        await expect(page.getByText('Strawberry')).not.toBeVisible();
    });
    test('Test Mocking 6: Intercept real API response and inject one extra item', async ({ page }) => {
        await page.route(url_route, async (route) => {
            const response = await route.fetch();
            const json = await response.json();

            json.unshift({ name: '🚨 Edge-Case Dragonfruit 🚨', id: 999 });
            await route.fulfill({ response, json});
        });
        await page.goto(url);
        await expect(page.getByText('🚨 Edge-Case Dragonfruit 🚨')).toBeVisible();
        await expect(page.getByText('Strawberry')).toBeVisible();
    });
    /// simulate slow netwroks
    test('Test Mocking 7: simulate a 3-second API delay', async ({ page }) => {
        await page.route(url_route, async (route) => {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await route.continue();
        });

        await page.goto(url);
        await expect(page.getByText('Strawberry')).toBeVisible();
    });
    /// Simulate kill connetion
    test('Test Mocking 8: simulate a complete network drop', async ({ page }) => {
        await page.route(url_route, async (route) => {
            await route.abort('internetdisconnected');
        });
        await page.goto(url);
        await expect(page.getByText('Strawberry')).not.toBeVisible();
    });
});

test.describe('Mocking: error handling', () => {
    for (const status of errorStatuses) {
        test(`The app renders no content when the fruits API returns ${status}`, async ({ page }) =>{
            await page.route(url_route, async (route) => {
                await route.fulfill({ status, json: { error: `Mock Error ${status} - Mock message!` } })
            });

            const pageError = page.waitForEvent('pageerror');
            await page.goto(url);
            await pageError;

            // demo handles error: It breaks and let empty the page
            await expect(page.getByRole('heading', { name: 'Render a List of Fruits' })).not.toBeVisible();
            await expect(page.getByText('Strawberry')).not.toBeVisible();
        });
    }

    test('The app shows the page but no fruits when the network drops', async ({ page }) => {
        await page.route(url_route, async (route) => {
            await route.abort('internetdisconnected');
        });

        const pageError = page.waitForEvent('pageerror');
        await page.goto(url);
        await pageError;

        await expect(page.getByRole('heading', { name: 'Render a List of Fruits'})).toBeVisible();
        await expect(page.getByRole('listitem')).toHaveCount(0);
    });
})
