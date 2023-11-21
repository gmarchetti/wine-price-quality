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

    addCtHref(href)
    {
        this.wineInfo.ctHref = href
    }

    getCtHref()
    {
        return this.wineInfo.ctHref
    }

    addBrand(brand)
    {
        this.wineInfo.brand = brand
    }

    getBrand()
    {
        return this.wineInfo.brand
    }

    addImgHref(imgHref)
    {
        this.wineInfo.imgHref = imgHref
    }

    getImgHref()
    {
        return this.wineInfo.imgHref
    }

    addType(wineType)
    {
        this.wineInfo.type = wineType
    }

    getType()
    {
        return this.wineInfo.type
    }

    updateQuality(newQuality)
    {
        this.wineInfo.quality = newQuality
    }

    getFullName()
    {
        return this.wineInfo.fullName
    }

    getQuality()
    {
        return this.wineInfo.quality
    }

    updateFullName(newName)
    {
        this.wineInfo.fullName = newName
    }

    updatePrice(newPrice)
    {
        this.wineInfo.price = newPrice
    }

    getPrice()
    {
        return this.wineInfo.price
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