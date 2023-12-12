import CTPageParser from "./parsers/ct-page-parser.js"
import VivinoQualityFetcher from "./vivino-item-fetcher/vivino-quality-fetcher.js"
import CTWineFetcher from "./ct-page-fetcher/ct-wine-page-fetcher.js"
import WineInfoDao from "../daos/wine-dao.js"
import Wine from "./wine.js"

export default class WineUpdater
{
    constructor(allowOverwrite)
    {
        this.wineFetcher = new CTWineFetcher()
        this.wineParser = new CTPageParser()
        this.qualityFetcher = new VivinoQualityFetcher()        
        this.allowOverwrite = allowOverwrite
    }

    async getWinePriceListing(numPages)
    {   

        const pageLimit = numPages || 0

        console.log(pageLimit)

        this.currentIndex = 0
        this.totalRequestedWines = 0
        this.totalWinesWithQuality = 0

        let updaterPromise = new Promise(async (resolve, reject) => {
            for (this.currentIndex = 0; this.currentIndex < pageLimit; this.currentIndex++)
            {
                console.info(`Parsing page ${this.currentIndex}\n`)
                let page = await this.wineFetcher.getWineBulkListingPage(this.currentIndex)
                let wines = await this.wineParser.getWinesFromListingPage(page)
                await this.wineFetcher.closeWinePage()
                await this.addQualityToPriceListing(wines)
                await this.qualityFetcher.closeWinePage()
            }        
            
            console.info("Finished Update Process")
            resolve()
        })
        
        
        return updaterPromise
    }

    
    async addQualityToPriceListing(wines){
        
        let fullWineListing = []
        let wineDao = new WineInfoDao()
        await wineDao.openConnection()

        for (const wine of wines)
        {
            if(wine != null)
            {
                await this.addVivinoInfo(wine)
                    .catch(error => {
                        console.error("== addVivinoInfoError: " + error.message)
                    })                
                fullWineListing.push(wine)
                console.info(wine.toJson())
                this.totalWinesWithQuality++
            }            
        };

        this.totalRequestedWines += fullWineListing.length
        
        await wineDao.saveAllWines(fullWineListing, this.allowOverwrite)
        await wineDao.closeConnection()

        return fullWineListing
    }

    async addVivinoInfo(wine)
    {
        try{
            await this.qualityFetcher.searchForTheWine(wine)

            const quality = await this.qualityFetcher.getWineQualityFromPage()
            wine.updateQuality(quality)

            const vivinoId = await this.qualityFetcher.getVivinoWineId()
            wine.updateVivinoId(vivinoId)

            const ratings = await this.qualityFetcher.getNumberOfRatings()
            wine.updateRatings(ratings)
        } catch(error){
            console.log("== searchForTheWineError: " + error.message)
        }
    }

    async fetchAllSavedWineInfo()
    {
    	let wineDao = new WineInfoDao()
        await wineDao.openConnection()
        
        const savedData = await wineDao.getAllWines()

        return savedData
    }
}