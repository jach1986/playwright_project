import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly cartBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.title = page.getByText('Products');
        this.cartBtn = page.getByLabel('Cart, empty');
    }
}