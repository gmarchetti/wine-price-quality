import puppeteer, { ConsoleMessage } from "puppeteer"

const CT_ITEM_TYPE = "http://schema.org/SomeProducts"

export default class SingleItemParser 
{
    constructor(page)
    {
        this.page = page
    }

    async getPrice(rawWineInfo)
    {
        let priceAsString = await rawWineInfo.$eval(".prices-wrapper > .sales > .value", (element) => {
            return element.getAttribute("content")
        })
        return parseFloat(priceAsString)
    }

    async getWineInfo(rawWineInfo)
    {
        let wineInfo = {}

        let winePrice = await this.getPrice(rawWineInfo)

        let wineNameElement = await rawWineInfo.$(".pwc-tile--description")
        let wineName = await (await wineNameElement.getProperty("innerText")).jsonValue()

        return wineInfo = {
            ["price"] : winePrice,
            ["fullName"] : wineName
        }
    }

    async getPriceFromSearchPage(page)
    {
        let priceElement = await page.$(".results-section > div:nth-child(2) > div:nth-child(2) > .product > .product-tile > .ct-inner-tile-wrap > .ct-tile-body > .ct-tile-bottom > .pwc-price-wrap > .price")
        return this.getPrice(priceElement)
    }

    async getPricesFromListingPage(page)
    {
        let wineList = []
        let rawWineList = await page.$$(`[itemType="${CT_ITEM_TYPE}"] > [data-idx]`)
        
        for (let i = 0; i < rawWineList.length; i++)
        {
            let element = await this.getWineInfo(rawWineList[i])
            wineList.push(element)
        }
        
        console.log(wineList)
        return wineList
    }
}
