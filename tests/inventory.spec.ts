import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';


const URL = 'https://www.saucedemo.com/inventory.html';

test('User can view the inventory without logging in manually', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await page.goto(URL);
    await expect(inventoryPage.title).toBeVisible();
});