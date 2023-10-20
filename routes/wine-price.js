import express from "express"
import Wine from "../models/wine.js"

const router = express.Router()


router.get("/:wineName", (req, res) => {
    // let wineName = req.params.wineName
    let wineName = "Mula Velha Reserva"
    console.log(wineName)

    let wine = new Wine(wineName)
    let winePrice = wine.getWinePrice()
    let wineQuality = wine.getWineQuality() 

    Promise.all([winePrice, wineQuality])
    .then((values) => {
        const response = {
            ["price"] : values[0],
            ["quality"] : values[1]
        }
        res.json(response)
    })
})

export default router