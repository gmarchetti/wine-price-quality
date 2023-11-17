import CTPageParser from "./parsers/ct-page-parser.js"
import VivinoQualityFetcher from "./vivino-item-fetcher/vivino-quality-fetcher.js"
import CTWineFetcher from "./ct-page-fetcher/ct-wine-page-fetcher.js"
import WineInfoDao from "../daos/wine-dao.js"
import Wine from "./wine.js"

export default class WineUpdater
{
    constructor()
    {
        this.wineFetcher = new CTWineFetcher()
        this.wineParser = new CTPageParser()
        this.qualityFetcher = new VivinoQualityFetcher()        
    }

    async getWinePriceListing(responseChannel)
    {   
        this.currentIndex = 0
        this.totalRequestedWines = 0
        this.totalWinesWithQuality = 0

        responseChannel.write("---- Parsing page 0 ----\n")
        responseChannel.write("-- Total requested wines -- Wines with Quality --\n")
        let page = await this.wineFetcher.getWineBulkListingPage()
        let prices = await this.wineParser.getPricesFromListingPage(page)
        
        await this.wineFetcher.closeWinePage()
        
        return prices
    }

    async addQualityToPriceListing(pricesListing, responseChannel){
        
        let fullWineListing = []
        let qualityFetchPromises = []
        let wineDao = new WineInfoDao("wine-info", "127.0.0.1", "guilherme", "admin")
        await wineDao.openConnection()

        for (const listing of pricesListing)
        {
            
            if(listing != null)
            {
                const wineName = listing.fullName
                let wine = new Wine(listing.ctId, listing.fullName, listing.price)
                qualityFetchPromises.push(this.getWineQuality(wineName))

                fullWineListing.push(wine)
            }            
        };

        this.totalRequestedWines += fullWineListing.length

        await Promise.allSettled(qualityFetchPromises)
            .then((results) => {
                for(let i = 0; i < results.length; i++)
                {
                    if(results[i].status == "fulfilled")
                    {
                        fullWineListing[i].updateQuality(results[i].value)
                        this.totalWinesWithQuality++
                    }
                    // responseChannel.write(fullWineListing[i].toJson())
                    responseChannel.write(`-- ${this.totalRequestedWines} -- ${this.totalWinesWithQuality} --\n`)
                }
            })
        
        await wineDao.saveAllWines(fullWineListing)
        await wineDao.closeConnection()

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

    async fetchAllSavedWineInfo()
    {
    	let wineDao = new WineInfoDao("wine-info", "127.0.0.1", "guilherme", "admin")
        await wineDao.openConnection()
        
        const savedData = await wineDao.getAllWines()

        return savedData
    }
}