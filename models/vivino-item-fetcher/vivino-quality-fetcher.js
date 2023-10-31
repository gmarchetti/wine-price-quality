import puppeteer from 'puppeteer';
import SearchBrowser from '../puppeteer/search-browser.js';

export default class VivinoQualityFetcher
{
    constructor(wineName)
    {
        this.wineName = wineName
    }

    async searchForTheWine()
    {
        this.browser = new SearchBrowser()
        this.page = await this.browser.getSearchPage()

        // Navigate the page to a URL
        await this.page.goto('https://www.vivino.com/search/wines?q=' + this.wineName);

        // await this.page.screenshot({ path: './screenshot.jpg' })

        return this.page
    }

    async closeWinePage()
    {
        this.browser.closeSearchPage()
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