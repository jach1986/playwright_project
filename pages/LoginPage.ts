import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    // define properties
    readonly page: Page;
    readonly userName: Locator;
    readonly passWord: Locator;
    readonly loginBtn: Locator;    
    readonly titleTargetPage: Locator;
    readonly cartBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userName = page.getByPlaceholder('Username');    
        this.passWord = page.getByPlaceholder('Password'); 
        this.loginBtn = page.getByRole('button', { name: 'Login' });  
        this.titleTargetPage = page.getByText('Products');
        this.cartBtn = page.getByLabel('Cart, empty');      
    }

    async goto(url: string) {
        await this.page.goto(url);
    };

    async login(username: string, passwrod: string){        
        await this.userName.fill(username);
        await this.passWord.fill(passwrod);
        await this.loginBtn.click();
    };
};