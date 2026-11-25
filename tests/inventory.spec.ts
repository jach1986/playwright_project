import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';


const URL = 'https://www.saucedemo.com/inventory.html';

test('User can view the inventory without logging in manually', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(URL);
    await expect(loginPage.titleTargetPage).toBeVisible();
});