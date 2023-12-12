import express from "express"
import WineInfoUpdater from "../models/wine-info-updater.js"

const router = express.Router()

router.get("/update", (req, res) => {
    let numPages = req.query.pages
    let allowQualityOverwrite = req.query.overwrite || false

    let wineUpdater = new WineInfoUpdater(allowQualityOverwrite)

    const response = {
        pages: numPages
    }
    
    wineUpdater.getWinePriceListing(numPages)
    res.status(200).json(response);
})

router.get("/", (req, res) => {        
    let wineUpdater = new WineInfoUpdater()

    wineUpdater.fetchAllSavedWineInfo()
    .then( savedData => {
        res.json(savedData)
    })
})

export default router