import express from "express"
import winePriceRoutes from "./routes/wine-info.js"
import statusRoutes from "./routes/status.js"

const app = express()

app.use("/wine-info", winePriceRoutes)
app.use("/", statusRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT)