import SingleItemParser from "./parsers/ct-single-item-parser.js"
import SingleItemFetcher from "./ct-page-fetcher/single-wine-page-fetcher.js"

export default class Wine
{
    constructor(wineName)
    {
        this.wineFetcher = new SingleItemFetcher(wineName)
        
    }

    async getWinePrice()
    {   
        let page = await this.wineFetcher.getWinePage()
        console.log(page)
        
        this.wineParser = new SingleItemParser(page)
        let price = await this.wineParser.getPrice()
        
        await this.wineFetcher.closeWinePage()
        
        return price
    }
}