import puppeteer from 'puppeteer';

export default class SearchBrowser
{
    constructor()
    {
        this.browser = null
        this.page = null   
    }

    async getSearchPage()
    {
        this.browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: { width: 1920, height: 1040 },
            devtools: false,
            args: ['--start-maximized', '--no-sandbox'],
        });

        this.page = await this.browser.newPage();
        
        await this.page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        );

        return this.page
    }

    async closeSearchPage()
    {
        await this.page.close()
        await this.browser.close()
    }
}