import SearchBrowser from "../puppeteer/search-browser.js";

export default class SingleWineFetcher
{
    constructor(wineName)
    {
        this.wineName = wineName
    }

    async getWinePage()
    {
        // Launch the browser and open a new blank page
        // this.browser = await puppeteer.launch();
        // this.page = await this.browser.newPage();

        // // Navigate the page to a URL
        // await this.page.goto('https://www.continente.pt/produto/mula-velha-reserva-regional-lisboa-vinho-tinto-mula-velha-5400380.html');

        // // Set screen size
        // await this.page.setViewport({width: 1080, height: 1024});

        // return this.page
        this.browser = new SearchBrowser()
        this.page = await this.browser.getSearchPage()
        
        await this.page.goto('https://www.continente.pt/produto/mula-velha-reserva-regional-lisboa-vinho-tinto-mula-velha-5400380.html');
        return this.page
    }

    async closeWinePage()
    {
        this.browser.closeSearchPage()
    }
}