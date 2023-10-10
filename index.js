import express from "express"
import winePriceRoutes from "./routes/wine-price.js"

const app = express()

app.use("/wine-price", winePriceRoutes)

app.listen(3000)