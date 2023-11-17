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
    }

    async getWinePriceListing(responseChannel)
    {   
        this.currentIndex = 0
        this.totalRequestedWines = 0
        this.totalWinesWithQuality = 0

        let updaterPromise = new Promise(async (resolve, reject) => {
            for (this.currentIndex = 0; this.currentIndex < 2; this.currentIndex++)
            {
                responseChannel.write(`---- Parsing page ${this.currentIndex} ----\n`)
                responseChannel.write("-- Total requested wines -- Wines with Quality --\n")
                let page = await this.wineFetcher.getWineBulkListingPage()
                let prices = await this.wineParser.getPricesFromListingPage(page)
                await this.addQualityToPriceListing(prices, responseChannel)
            }        
            
            await this.wineFetcher.closeWinePage()
            responseChannel.write("-- Finished Update Process --\n")
            resolve()
        })
        
        
        return updaterPromise
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
                // qualityFetchPromises.push(this.getWineQuality(wineName))
                const quality = await this.getWineQuality(wineName)
                wine.updateQuality(quality)
                fullWineListing.push(wine)

                responseChannel.write(`-- ${this.totalRequestedWines} -- ${this.totalWinesWithQuality} --\n`)
                responseChannel.write(wine.toJson() + "\n")
                this.totalWinesWithQuality++
            }            
        };

        this.totalRequestedWines += fullWineListing.length
        
        await wineDao.saveAllWines(fullWineListing)
        await wineDao.closeConnection()

        return fullWineListing
    }

    async getWineQuality(wineName)
    {
        const qualityFetcher = new VivinoQualityFetcher()
        console.log("Searching wine in Vivino")
        await qualityFetcher.searchForTheWine(wineName)
            .catch((error) => {
                console.log(error)
            })

        console.log("Parsing Wine Rating")
        let quality = await qualityFetcher.getWineQualityFromPage()
            .catch((error) => {
                quality = null
                console.log(error)
            }
        )
        qualityFetcher.closeWinePage()

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