import express from "express"
import winePriceRoutes from "./routes/wine-info.js"

const app = express()

app.use("/wine-info", winePriceRoutes)

app.listen(3000)