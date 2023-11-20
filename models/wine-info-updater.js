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
            for (this.currentIndex = 0; this.currentIndex < 1; this.currentIndex++)
            {
                responseChannel.write(`---- Parsing page ${this.currentIndex} ----\n`)
                responseChannel.write("-- Total requested wines -- Wines with Quality --\n")
                let page = await this.wineFetcher.getWineBulkListingPage(this.currentIndex)
                let wines = await this.wineParser.getWinesFromListingPage(page)
                await this.addQualityToPriceListing(wines, responseChannel)
            }        
            
            await this.wineFetcher.closeWinePage()
            responseChannel.write("-- Finished Update Process --\n")
            resolve()
        })
        
        
        return updaterPromise
    }

    
    async addQualityToPriceListing(wines, responseChannel){
        
        let fullWineListing = []
        let wineDao = new WineInfoDao("wine-info", "127.0.0.1", "guilherme", "admin")
        await wineDao.openConnection()

        for (const wine of wines)
        {
            if(wine != null)
            {
                const quality = await this.getWineQuality(wine)
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

    async getWineQuality(wine)
    {
        const qualityFetcher = new VivinoQualityFetcher()
        console.log("Searching wine in Vivino")
        await qualityFetcher.searchForTheWine(wine.getSearchName())
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