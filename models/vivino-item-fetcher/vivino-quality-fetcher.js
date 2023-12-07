import puppeteer from 'puppeteer';
import SearchBrowser from '../puppeteer/search-browser.js';

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

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
            this.page = await this.browser.getSearchPage()
        }
        
        let wineToSearch = externalWine || this.wine

        const encodedUrl = encodeURI('https://www.vivino.com/search/wines?q=' + this.buildSearchName(wineToSearch))
        
        // Navigate the page to a URL
        let status = await this.page.goto(encodedUrl);
        if(status.status() == 429)
        {
            console.log("== Received 429 response, waiting sleeping for sometime")
            await delay(30000)
            console.log("== Resuming")
        }

        return this.page
    }

    async closeWinePage()
    {
        await this.browser.closeSearchPage()
        this.browser = null
        this.page = null
    }

    async getVivinoWineId(externalPage)
    {
        let winePage = externalPage || this.page
        if (winePage == null)
        {
            throw new Error("Neither internal or external wine page provided")
        }

        let vivinoWineId = await winePage.$eval(".search-results-list > div:nth-child(1) > .default-wine-card", (element) => {
            return element.getAttribute("data-vintage")
        })
        .catch( (error) => {
            console.error(error.message)
        })

        return vivinoWineId
    }

    async getNumberOfRatings(externalPage)
    {
        let winePage = externalPage || this.page
        if (winePage == null)
        {
            throw new Error("Neither internal or external wine page provided")
        }

        const ratingsFromPage = await winePage.$eval(".search-results-list > div:nth-child(1) > .default-wine-card > .wine-card__content > .text-color-alt-gray > .average__container > .text-inline-block > .text-micro", (element) => {
            return element.innerText
        })
        .catch( (error) => {
            console.error(error.message)
        })

        let ratingsText = ratingsFromPage || "0"
        ratingsText = ratingsText.split(" ")[0]

        return parseInt(ratingsText)
    }

    async getWineQualityFromPage(externalPage)
    {
        let winePage = externalPage || this.page
        if (winePage == null)
        {
            throw new Error("Neither internal or external wine page provided")
        }

        const qualityFromPage = await winePage.$eval(".search-results-list > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)", (element) => {
            return element.innerText
        })
        .catch((error) => {
            console.error(error.message)
        })

        const qualityAsText = qualityFromPage || "0.0"
        const qualityAsNumber = parseFloat(qualityAsText.replace(/,/g, '.'))

        return qualityAsNumber
    }
}