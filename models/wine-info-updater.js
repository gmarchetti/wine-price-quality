import CTPageParser from "./parsers/ct-page-parser.js"
import VivinoQualityFetcher from "./vivino-item-fetcher/vivino-quality-fetcher.js"
import CTWineFetcher from "./ct-page-fetcher/ct-wine-page-fetcher.js"

export default class WineUpdater
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

    async addQualityToPriceListing(pricesListing){
        
        let fullWineListing = []
        let wineName

        // pricesListing.forEach(listing => {
        for (const listing of pricesListing)
        {
            let completedListing = {}
            
            if(listing != null)
            {
                wineName = listing.fullName
                console.log(wineName)

                completedListing["price"] = listing.price
                completedListing["fullName"] = listing.fullName
                completedListing["ctId"] = listing.ctId
                completedListing["quality"] = await this.getWineQuality(wineName)
                    .catch(error => {
                        console.error(error)
                        completedListing["quality"] = null
                    })

                fullWineListing.push(completedListing)
            }            
        };

        return fullWineListing
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