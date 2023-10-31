import CTPageParser from "./parsers/ct-page-parser.js"
import VivinoQualityFetcher from "./vivino-item-fetcher/vivino-quality-fetcher.js"
import CTWineFetcher from "./ct-page-fetcher/ct-wine-page-fetcher.js"

export default class Wine
{
    constructor(wineName)
    {
        this.wineFetcher = new CTWineFetcher(wineName)
        this.qualityFetcher = new VivinoQualityFetcher(wineName)        
    }

    async getWinePrice()
    {   
        let page = await this.wineFetcher.searchWine()
        
        this.wineParser = new CTPageParser(page)
        let price = await this.wineParser.getPriceFromSearchPage(page)
        
        await this.wineFetcher.closeWinePage()
        
        return price
    }

    async getWineQuality()
    {
        console.log("Searching wine in Vivino")
        await this.qualityFetcher.searchForTheWine()

        console.log("Parsing Wine Rating")
        let quality = await this.qualityFetcher.getWineQualityFromPage()

        return quality
    }
}