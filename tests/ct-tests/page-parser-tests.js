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
        let priceList = await priceParser.getWinesFromListingPage(winePage)
        assert.equal(Object.keys(priceList).length, 24)
    });
    
    it('Price attribute should not be empty', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.notEqual(priceList[0].getPrice(), null)
    });    

    it('First price should be 3.29', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[0].getPrice(), 3.29)
    });

    it('Last price should be 4.99', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[priceList.length - 1].getPrice(), 4.99)
    });

    it('Full name attribute should not be empty', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.notEqual(priceList[0].getFullName(), null)
    });

    it('First full name should be Mula Velha Reserva Regional Lisboa Vinho Tinto', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[0].getFullName(), "Mula Velha Reserva Regional Lisboa Vinho Tinto")
    });

    it('First Continent Link should be https://www.continente.pt/produto/mula-velha-reserva-regional-lisboa-vinho-tinto-mula-velha-5400380.html', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[0].getCtHref(), "https://www.continente.pt/produto/mula-velha-reserva-regional-lisboa-vinho-tinto-mula-velha-5400380.html")
    });

    it('First Manufacturer should be Mula Velha', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[0].getBrand(), "Mula Velha")
    });

    it('First Img Href should be Mula Velha Reserva Regional Lisboa Vinho Tinto', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[0].getImgHref(), "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw14e64774/images/col/540/5400380-frente.jpg?sw=280&sh=280")
    });

    it('First item type Vinho Tinto', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[0].getType(), "Vinho Tinto")
    });

    it('Last full name should be Tapada das Lebres Signature Regional Alentejano Vinho Tinto', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[priceList.length - 1].getFullName(), "Tapada das Lebres Signature Regional Alentejano Vinho Tinto")
    });

    it('Continente Id should not be empty', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.notEqual(priceList[0].getCtId(), null)
    });

    it('First Continente Id should be 5400380', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[0].getCtId(), "5400380")
    });

    it('14th Continente Id should be 6037014', async function () {        
      let priceList = await priceParser.getWinesFromListingPage(winePage)
      assert.equal(priceList[13].getCtId(), "6037014")
    });

    afterEach(async function(){
        browser.closeSearchPage()
    });
  });
});
