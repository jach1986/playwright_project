import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage'; 


const authFile = 'playwright/.auth/user.json';
const URL = 'https://www.saucedemo.com/';
const userNameType = process.env.SAUCE_USERNAME!;
const passwordType = process.env.SAUCE_PASSWORD!;

setup('Authenticate User', async ({ page })=>{
    const loginPage = new LoginPage(page);
    await loginPage.goto(URL);
    await loginPage.login(userNameType, passwordType);
    await expect(loginPage.titleTargetPage).toBeVisible();
    await page.context().storageState({ path: authFile });
});