import puppeteer from 'puppeteer';
import SearchBrowser from '../puppeteer/search-browser.js';

export default class VivinoQualityFetcher
{
    constructor(wine)
    {
        this.wine = wine
    }

    buildSearchName(wine)
    {
        

        const fullName = wine.getFullName()
        const wineType = wine.getType()
        const brand = wine.getBrand()

        let removedType = fullName.split(wineType)[0]
        removedType = removedType.trim()

        let shortName = removedType.split("Regional")[0]
        shortName = shortName.replace("DOC", "")
        shortName = shortName.trim()

        let shortType = wineType.split("Vinho")[1]
        shortType = shortType.replace("Tinto", "")
        shortType = shortType.trim()

        let searchName = `${shortName} ${shortType}`
        
        return searchName
    }

    async searchForTheWine(externalWine)
    {
        if (this.browser == null){
            this.browser = new SearchBrowser()
        }
        
        let wineToSearch = externalWine ? externalWine : this.wine
        
        this.page = await this.browser.getSearchPage()
        
        const encodedUrl = encodeURI('https://www.vivino.com/search/wines?q=' + this.buildSearchName(wineToSearch))
        
        // Navigate the page to a URL
        await this.page.goto(encodedUrl);
        // await this.page.screenshot({ path: './screenshot.jpg' })

        return this.page
    }

    async closeWinePage()
    {
        this.browser.closeSearchPage()
        this.browser = null
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