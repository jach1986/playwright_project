import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.use({ storageState: { cookies: [], origins: []}}); // to avoid setup

const URL = 'https://www.saucedemo.com/';
const userNameType = process.env.SAUCE_USERNAME!;
const passwordType = process.env.SAUCE_PASSWORD!;

test('User can login with valid credentials - (using POM)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);    
    await loginPage.goto(URL);
    await loginPage.login(userNameType, passwordType);
    await expect(inventoryPage.title).toBeVisible();
    await expect(inventoryPage.cartBtn).toBeEnabled();
});