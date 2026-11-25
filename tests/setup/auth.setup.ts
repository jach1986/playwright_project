import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage'; 
import { InventoryPage } from '../../pages/InventoryPage';


const authFile = 'playwright/.auth/user.json';
const URL = 'https://www.saucedemo.com/';
const userNameType = process.env.SAUCE_USERNAME!;
const passwordType = process.env.SAUCE_PASSWORD!;

setup('Authenticate User', async ({ page })=>{
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto(URL);
    await loginPage.login(userNameType, passwordType);
    await expect(inventoryPage.title).toBeVisible();
    await page.context().storageState({ path: authFile });
});