import SingleItemParser from "./parsers/ct-single-item-parser.js"
import SingleItemFetcher from "./ct-page-fetcher/single-wine-page-fetcher.js"
import VivinoQualityFetcher from "./vivino-item-fetcher/vivino-quality-fetcher.js"
import { ConsoleMessage } from "puppeteer"

export default class Wine
{
    constructor(wineName)
    {
        this.wineFetcher = new SingleItemFetcher(wineName)
        this.qualityFetcher = new VivinoQualityFetcher(wineName)        
    }

    async getWinePrice()
    {   
        let page = await this.wineFetcher.getWinePage()
        console.log(page)
        
        this.wineParser = new SingleItemParser(page)
        let price = await this.wineParser.getPrice()
        
        await this.wineFetcher.closeWinePage()
        
        return price
    }

    async getWineQuality()
    {
        console.log("Searching wine in Vivino")
        await this.qualityFetcher.searchForTheWine()

        console.log("Parsing Wine Rating")
        let quality = await this.qualityFetcher.getWineQuality()

        return quality
    }
}