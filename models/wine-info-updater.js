import CTPageParser from "./parsers/ct-page-parser.js"
import VivinoQualityFetcher from "./vivino-item-fetcher/vivino-quality-fetcher.js"
import CTWineFetcher from "./ct-page-fetcher/ct-wine-page-fetcher.js"

export default class Wine
{
    constructor()
    {
        this.wineFetcher = new CTWineFetcher()
        this.wineParser = new CTPageParser()
        this.qualityFetcher = new VivinoQualityFetcher()        
    }

    async getWinePriceListing(index)
    {   
        let page = await this.wineFetcher.getWineBulkListingPage()
        let prices = await this.wineParser.getPricesFromListingPage(page)
        
        await this.wineFetcher.closeWinePage()
        
        return prices
    }

    async getWineQuality(wineName)
    {
        console.log("Searching wine in Vivino")
        await this.qualityFetcher.searchForTheWine(wineName)

        console.log("Parsing Wine Rating")
        let quality = await this.qualityFetcher.getWineQualityFromPage()

        return quality
    }
}