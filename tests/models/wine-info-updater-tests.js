import assert, { doesNotMatch } from 'assert';
// import path from 'path'
// import SearchBrowser from '../../models/puppeteer/search-browser.js';
import WineInfoUpdater from "../../models/wine-info-updater.js"

describe('WineInfoUpdater', function () {

  describe('getWinePriceListing()', function() {
    let wineUpdater = new WineInfoUpdater()

    // beforeEach(async function(){
    //     browser = new SearchBrowser()
    //     winePage = await browser.getSearchPage()
    //     await winePage.goto("file://" + path.resolve("./tests/sample-data/vivino-sample.html"))
    // });

    it('Dict size should be 24', async function() {
        let priceListing = await wineUpdater.getWinePriceListing()
        
        assert.equal(Object.keys(priceListing).length, 24)
    });

    // afterEach(async function(){
    //     browser.closeSearchPage()
    //     winePage = null
    // });
  });
});