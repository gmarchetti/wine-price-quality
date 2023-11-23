import express from "express"
import WineInfoDao from "../daos/wine-dao.js"

const router = express.Router()

router.get("/status", (req, res) => {
    let dbConnectionStatus = "connected"
    let status = {
        ["id"] : process.env.GAE_APPLICATION || "local",
        ["env"] : process.env.GAE_ENV || "local",
        ["service"] : process.env.GAE_SERVICE || "local",
        ["project"] : process.env.GOOGLE_CLOUD_PROJECT || "local",
        ["deployId"] : process.env.GAE_DEPLOYMENT_ID || "local",
        ["dbAddres"] : process.env.DB_ADDR || "local"
    }

    const wineDao = new WineInfoDao()
    wineDao.openConnection()
        .catch(() => {
            dbConnectionStatus = "failed"
            
        })
        .finally(() => {
            status.dbConnection = dbConnectionStatus
            res.status(200).json(status)
        })
})

router.get("/", (req, res) => {        
    res.sendStatus(200)
})

export default router