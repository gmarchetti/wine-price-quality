import express from "express"
import WineInfoUpdater from "../models/wine-info-updater.js"

const router = express.Router()

router.get("/update", (req, res) => {
    let numPages = req.query.pages

    let wineUpdater = new WineInfoUpdater()

    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff'
      });

    let priceListing = wineUpdater.getWinePriceListing(res, numPages)

    priceListing
        .then( prices => {
            res.end()
        }) 
})

router.get("/", (req, res) => {        
    let wineUpdater = new WineInfoUpdater()

    wineUpdater.fetchAllSavedWineInfo()
    .then( savedData => {
        res.json(savedData)
    })
})

export default router