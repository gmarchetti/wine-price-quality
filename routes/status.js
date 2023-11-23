import express from "express"

const router = express.Router()

router.get("/status", (req, res) => {
    const status = {
        ["id"] : process.env.GAE_APPLICATION || "local",
        ["env"] : process.env.GAE_ENV || "local",
        ["service"] : process.env.GAE_SERVICE || "local",
        ["project"] : process.env.GOOGLE_CLOUD_PROJECT || "local",
        ["deployId"] : process.env.GAE_DEPLOYMENT_ID || "local"
    }
    res.status(200).json(status)
})

router.get("/", (req, res) => {        
    res.sendStatus(200)
})

export default router