import assert, { doesNotMatch } from 'assert';
import path from 'path'
import CTPageParser from "../../models/parsers/ct-page-parser.js"
import SearchBrowser from '../../models/puppeteer/search-browser.js';

describe('CTPageParser', function () {

  describe('getPriceFromSearchPage()', function() {
    let priceParser = new CTPageParser("sample-name")
    let winePage
    let browser

    beforeEach(async function(){
        browser = new SearchBrowser()
        winePage = await browser.getSearchPage()
        await winePage.goto("file://" + path.resolve("./tests/sample-data/ct-sample.html"))
    });

    it('Wine page should not be null', function() {
        assert.notEqual(winePage, null)
    });

    it('Price should be 3.29', async function () {        
        let price = await priceParser.getPriceFromSearchPage(winePage)
        assert.equal(price, 3.29)
    });

    afterEach(async function(){
        browser.closeSearchPage()
    });
  });

  describe('parseFullWineListing()', function() {
    let priceParser = new CTPageParser()
    let winePage
    let browser

    beforeEach(async function(){
        browser = new SearchBrowser()
        winePage = await browser.getSearchPage()
        await winePage.goto("file://" + path.resolve("./tests/sample-data/red-wine-first-page.html"))
    });

    it('Wine Listing page should not be null', function() {
        assert.notEqual(winePage, null)
    });

    it('Dict size should be 24', async function () {        
        let priceList = await priceParser.getPricesFromListingPage(winePage)
        assert.equal(Object.keys(priceList).length, 24)
    });

    afterEach(async function(){
        browser.closeSearchPage()
    });
  });
});
