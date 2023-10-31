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
        this.browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: { width: 1920, height: 1040 },
            devtools: false,
            args: ['--start-maximized'],
        });

        this.page = await this.browser.newPage();


        // need to set User Agent else an empty result
        // it seems they detect headless Chrome
        // from: https://github.com/aptash/vivino-api/blob/main/vivino.js
        await this.page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        );

        // Navigate the page to a URL
        await this.page.goto('https://www.vivino.com/search/wines?q=' + this.wineName);

        // await this.page.screenshot({ path: './screenshot.jpg' })

        return this.page
    }

    async closeWinePage()
    {
        this.browser.close()
        this.page = null
    }

    async getWineQualityFromPage(externalPage)
    {
        let winePage = externalPage ? externalPage : this.page
        if (winePage == null)
        {
            throw new Error("Neither internal or external wine page provided")
        }

        let qualityAsText = await winePage.$eval(".search-results-list > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)", (element) => {
            return element.innerText
        })

        let qualityAsNumber = parseFloat(qualityAsText.replace(/,/g, '.'))

        return qualityAsNumber
    }
}