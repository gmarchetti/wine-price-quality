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
    let wineUpdater = new WineInfoUpdater()

    let priceListing = wineUpdater.getWinePriceListing()

    priceListing
        .then( prices => {
            return wineUpdater.addQualityToPriceListing(prices)
        }) 
        .then( pricesWithQuality => {
            res.json(pricesWithQuality)
        })
})

router.get("/", (req, res) => {
    

    priceListing
        .then( prices => {
            return wineUpdater.addQualityToPriceListing(prices)
        }) 
        .then( pricesWithQuality => {
            res.json(pricesWithQuality)
        })
})

export default router