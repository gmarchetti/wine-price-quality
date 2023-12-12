import puppeteer from 'puppeteer';
import SearchBrowser from '../puppeteer/search-browser.js';

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const WINE_QUALIFIERS_LIST = [
    "reserva",
    "especial",
    "vinhas velhas",
    "premium",
    "signature "
]

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

        let searchName = `${brand} ${shortName} ${shortType}`
        
        return searchName
    }

    async getCurretnWinePage()
    {
        return this.page
    }

    async searchForTheWine(externalWine)
    {
        if (this.browser == null){
            this.browser = new SearchBrowser()
            this.page = await this.browser.getSearchPage()
        }
        
        this.wine = externalWine

        const encodedUrl = encodeURI('https://www.vivino.com/search/wines?q=' + this.buildSearchName(this.wine))

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

    async getVivinoWineIdFromCard(element)
    {
        let vivinoWineId = await element?.$eval(".default-wine-card", (element) => {
            return element.getAttribute("data-vintage")
        })
        .catch( (error) => {
            console.error(error.message)
        })

        return vivinoWineId
    }

    async getVivinoWineId(externalPage)
    {
        let winePage = externalPage || this.page
        if (winePage == null)
        {
            throw new Error("Neither internal or external wine page provided")
        }

        const element = await this.findCorrectWineCard(winePage)
        return await this.getVivinoWineIdFromCard(element)
    }

    async getNumberOfRatingsFromCard(element)
    {
        const ratingsFromPage = await element?.$eval(".default-wine-card > .wine-card__content > .text-color-alt-gray > .average__container > .text-inline-block > .text-micro", (element) => {
            return element.innerText
        })
        .catch( (error) => {
            console.error(error.message)
        })

        let ratingsText = ratingsFromPage || "0"
        ratingsText = ratingsText.split(" ")[0]

        return parseInt(ratingsText)
    }

    async getNumberOfRatings(externalPage)
    {
        let winePage = externalPage || this.page

        if (winePage == null)
        {
            throw new Error("Neither internal or external wine page provided")
        }

        const element = await this.findCorrectWineCard(winePage)
        return await this.getNumberOfRatingsFromCard(element)
    }

    async getElementFromSearchResult(page, index)
    {
        const searchItem = await page.$(`.search-results-list > div:nth-child(${index})`)
        return searchItem
    }

    async getWineName(searchElement)
    {
        if (searchElement == null)
        {
            throw new Error("== getWineName: No wine element provided")
        }
        
        const wineName = await searchElement.$eval(".default-wine-card > div:nth-child(2) > div:nth-child(1) > span:nth-child(1) > a:nth-child(1)", (element) => {
            return element.innerText
        })
        
        return wineName
    }
    
    validateResultWineName(searchedWine, resultWineName)
    {        
        const brand = searchedWine.getBrand().toLowerCase()
        const lowerWineName = searchedWine.getFullName().toLowerCase()
        const lowerResultWineName = resultWineName.toLowerCase()
        
        let namesMatch = true

        if(!lowerResultWineName.includes(brand))
            namesMatch = false

        for(const qualifier of WINE_QUALIFIERS_LIST)
        {   
            if(lowerWineName.includes(qualifier) != lowerResultWineName.includes(qualifier))
            {
                namesMatch = false
            }
        }

        return namesMatch
    }
    
    async findCorrectWineCard(externalPage)
    {
        let wineName
        let wineCardElement
        let winePage = externalPage || this.page
        let matchFound = false

        if (winePage == null)
        {
            throw new Error("Neither internal or external wine page provided")
        }
        
        const numResultChildren = (await winePage.$$(".card")).length

        for (let i = 1; i <= numResultChildren && !matchFound; i++)
        {
            
            wineCardElement = await this.getElementFromSearchResult(winePage, i)
            wineName = await this.getWineName(wineCardElement)
            matchFound = this.validateResultWineName(this.wine, wineName)
        }

        if (matchFound)
            return wineCardElement
        else
            return undefined
    }

    async getWineQualityFromCard(wineCardElement)
    {
        let qualityFromPage = await wineCardElement?.$eval("div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)", (element) => {
            return element.innerText
        })
        .catch((error) => {
            console.error(error.message)
        })

        const qualityAsText = qualityFromPage || "0.0"
        const qualityAsNumber = parseFloat(qualityAsText.replace(/,/g, '.'))

        return qualityAsNumber
    }

    async getWineQualityFromPage(externalPage)
    {
        let winePage = externalPage || this.page

        if (winePage == null)
        {
            throw new Error("Neither internal or external wine page provided")
        }

        const element = await this.findCorrectWineCard(winePage)
        return await this.getWineQualityFromCard(element)
    }
}