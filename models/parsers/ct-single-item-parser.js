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

}
