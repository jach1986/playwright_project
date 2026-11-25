import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    // define properties
    readonly page: Page;
    readonly userName: Locator;
    readonly password: Locator;
    readonly loginBtn: Locator;        

    constructor(page: Page) {
        this.page = page;
        this.userName = page.getByPlaceholder('Username');    
        this.password = page.getByPlaceholder('Password'); 
        this.loginBtn = page.getByRole('button', { name: 'Login' });              
    }

    async goto(url: string) {
        await this.page.goto(url);
    };

    async login(username: string, passwrod: string){        
        await this.userName.fill(username);
        await this.password.fill(passwrod);
        await this.loginBtn.click();
    };
};