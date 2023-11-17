import SearchBrowser from "../puppeteer/search-browser.js";

const CT_SEARCH_URL = "https://www.continente.pt/pesquisa/?"
const CT_BULK_URL = 'https://www.continente.pt/bebidas-e-garrafeira/vinhos/?start='

export default class CTWineFetcher
{
    constructor(wineName)
    {
        this.wineName = wineName
    }

    async getWinePage()
    {
        // return this.page
        this.browser = new SearchBrowser()
        this.page = await this.browser.getSearchPage()
        
        await this.page.goto('https://www.continente.pt/produto/mula-velha-reserva-regional-lisboa-vinho-tinto-mula-velha-5400380.html');
        return this.page
    }

    async getWineBulkListingPage(index)
    {
        // return this.page
        this.browser = new SearchBrowser()
        this.page = await this.browser.getSearchPage()
        
        await this.page.goto(CT_BULK_URL + index);
        return this.page
    }

    async searchWine()
    {
        let queryParams = new URLSearchParams()
        queryParams.set("q", this.wineName)

        let searchUrl = CT_SEARCH_URL + queryParams.toString()

        console.log(searchUrl)
        this.browser = new SearchBrowser()
        this.page = await this.browser.getSearchPage()
        
        await this.page.goto(searchUrl);
        return this.page
    }

    async closeWinePage()
    {
        this.browser.closeSearchPage()
    }
}