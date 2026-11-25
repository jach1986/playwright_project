import { test, expect } from 'playwright/test';
import { LoginPage } from '../pages/LoginPage';

const URL = 'https://www.saucedemo.com/';
const userNameType = 'standard_user';
const passwordType = 'secret_sauce';

test('User can login using POM', async ({ page }) => {
    const loginPage = new LoginPage(page);    
    await loginPage.goto(URL);
    await loginPage.login(userNameType, passwordType);
    await expect(loginPage.titleTargetPage).toBeVisible();
    await expect(loginPage.cartBtn).toBeEnabled();
});

