import express from "express"
import WineInfoUpdater from "../models/wine-info-updater.js"

const router = express.Router()

// router.get("/:wineName", (req, res) => {
//     // let wineName = req.params.wineName
//     let wineName = "Mula Velha Reserva"
//     console.log(wineName)

//     let wine = new Wine(wineName)
//     let winePrice = wine.getWinePrice()
//     let wineQuality = wine.getWineQuality() 

//     Promise.all([winePrice, wineQuality])
//     .then((values) => {
//         const response = {
//             ["price"] : values[0],
//             ["quality"] : values[1]
//         }
//         res.json(response)
//     })
// })

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