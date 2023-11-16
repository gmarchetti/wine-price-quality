export default class Wine
{
    constructor(ctId, name, price, quality)
    {
        this.wineInfo = {
            ["ctId"] : ctId,
            ["fullName"] : name,
            ["price"] : price,
            ["quality"] : quality
        }
    }

    updateQuality(newQuality)
    {
        this.wineInfo.quality = newQuality
    }

    updateFullName(newName)
    {
        this.wineInfo.fullName = newName
    }

    updatePrice(newPrice)
    {
        this.wineInfo.price = newPrice
    }

    getCtId()
    {
        return this.wineInfo.ctId
    }

    toJson()
    {
        const data = Object.fromEntries(Object.entries(this.wineInfo).filter(([k,v]) => v))
        return JSON.stringify(data)
    }
}