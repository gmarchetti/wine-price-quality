import puppeteer from 'puppeteer';

export default class VivinoQualityFetcher
{
    constructor(wineName)
    {
        this.wineName = wineName
    }

    async searchForTheWine()
    {
        // Launch the browser and open a new blank page
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();

        // Navigate the page to a URL
        await this.page.goto('https://www.vivino.com/search/wines?q=' + this.wineName);

        // Set screen size
        await this.page.setViewport({width: 1080, height: 1024});

        return this.page
    }

    async closeWinePage()
    {
        this.browser.close()
        this.page = null
    }

    async getWineQuality()
    {
        if (this.page == null)
        {
            throw new Error("No wine page loaded")
        }

        let quality = await this.page.$eval(".search-results-list > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)", (element) => {
            return element.getText()
        })

        return quality
    }
}