import Wine from "../wine.js"

const CT_ITEM_TYPE = "http://schema.org/SomeProducts"

export default class CTWineParser 
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

    // add ct href, img href, manufacturer, type
    async getWineInfo(rawWineInfo)
    {
        let wine
        let winePrice = await this.getPrice(rawWineInfo)

        try {
            let wineNameElement = await rawWineInfo.$(".pwc-tile--description")
            let wineName = await (await wineNameElement.getProperty("innerText")).jsonValue()
            wineName = wineName.replace("'", "")
            
            let wineCtId = await rawWineInfo.$eval(".product", (element) => {
                return element.getAttribute("data-pid")
            })

            const infoAsJson = await rawWineInfo.$eval(".product-tile", (element) => {
                return element.getAttribute("data-product-tile-impression")
            })

            wine = new Wine(wineCtId, wineName, winePrice)

            const info = JSON.parse(infoAsJson)
            const brandName = info.brand
            wine.addBrand(brandName)
        
            const wineType = info.category.split("/")[2]
            wine.addType(wineType)

            let ctHref = await rawWineInfo.$eval(".pwc-tile--description", (element) => {
                return element.getAttribute("href")
            })
            wine.addCtHref(ctHref)

            let wineImgHref = await rawWineInfo.$eval(".ct-tile-image", (element) => {
                return element.getAttribute("data-src")
            })
            wine.addImgHref(wineImgHref)

        } catch (error) {
            console.error(error)
        } finally {
            return wine
        }
    }

    async getPriceFromSearchPage(page)
    {
        let priceElement = await page.$(".results-section > div:nth-child(2) > div:nth-child(2) > .product > .product-tile > .ct-inner-tile-wrap > .ct-tile-body > .ct-tile-bottom > .pwc-price-wrap > .price")
        return this.getPrice(priceElement)
    }

    async getWinesFromListingPage(page)
    {
        let wineList = []
        let rawWineList = await page.$$(`[itemType="${CT_ITEM_TYPE}"] > [data-idx]`)
        
        for (let i = 0; i < rawWineList.length; i++)
        {
            let element = await this.getWineInfo(rawWineList[i])
            wineList.push(element)
        }
        
        return wineList
    }
}
