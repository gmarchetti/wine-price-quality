import puppeteer from "puppeteer"

export default class SingleItemParser 
{
    constructor(page)
    {
        this.page = page
    }

    async getPrice()
    {
        let price = await this.page.$eval(".prices-wrapper > .sales > .value", (element) => {
            return element.getAttribute("content")
        })
        return price
    }

    async getPriceFromSearchPage(page)
    {
        let priceAsString = await page.$eval(".results-section > div:nth-child(2) > div:nth-child(2) > .product > .product-tile > .ct-inner-tile-wrap > .ct-tile-body > .ct-tile-bottom > .pwc-price-wrap > .price > .prices-wrapper > .sales > .value", (element) => {
            return element.getAttribute("content")
        })
        return parseFloat(priceAsString)
    }
}
