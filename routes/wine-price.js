import express from "express"
import Wine from "../models/wine.js"

const router = express.Router()


router.get("/:wineName", (req, res) => {
    let wineName = req.params.wineName
    console.log(wineName)

    let wine = new Wine(wineName)
    wine.getWinePrice()
        .then((value) => {
            const response = {["price"] : value}
            res.json(response)
        })
})

export default router