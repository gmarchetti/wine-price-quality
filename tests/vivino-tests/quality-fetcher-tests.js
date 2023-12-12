import assert, { doesNotMatch } from 'assert';
import path from 'path'
import VivinoQualityFetcher from "../../models/vivino-item-fetcher/vivino-quality-fetcher.js"
import SearchBrowser from '../../models/puppeteer/search-browser.js';
import { describe } from 'mocha';
import Wine from '../../models/wine.js';

describe('VivinoQualityFetcher', function () {

  describe('getWineQualityFromPage()', function() {
    let wine = new Wine("", "Mula Velha Reserva Branco")
    wine.addBrand("Mula Velha")
    let qualityFetcher = new VivinoQualityFetcher(wine)
    let winePage
    let browser

    beforeEach(async function(){
        browser = new SearchBrowser()
        winePage = await browser.getSearchPage()
        await winePage.goto("file://" + path.resolve("./tests/sample-data/vivino-sample.html"))
    });

    it('Wine page should not be null', function() {
        assert.notEqual(winePage, null)
    });

    it('Quality should be a number equal to 3.7', async function () {        
        let quality = await qualityFetcher.getWineQualityFromPage(winePage)
        assert.equal(quality, 3.7)
    });

    it('Id should be 13938997', async function () {        
      let id = await qualityFetcher.getVivinoWineId(winePage)
      assert.equal(id, 13938997)
    });

    it('Number of ratings should be 4926', async function () {        
      let ratings = await qualityFetcher.getNumberOfRatings(winePage)
      assert.equal(ratings, 4926)
    });

    afterEach(async function(){
        browser.closeSearchPage()
        winePage = null
    });
  });

  describe("Search and Fetch Wine quality", async function() {
    const qualityFetcher = new VivinoQualityFetcher("")

    it("Mula Velha Quality should be 3.7", async function() {
        const wine = new Wine('5400380', 'Mula Velha Reserva Regional Lisboa Vinho Tinto', "3.29")
        wine.addBrand("Mula Velha")
        wine.addType("Vinho Tinto")

        const winePage = await qualityFetcher.searchForTheWine(wine)
        const quality = await qualityFetcher.getWineQualityFromPage(winePage)

        assert.equal(quality, 3.7)
    });

    it("Papa Figos Quality should be 3.9", async function() {
      const wine = new Wine('4952282', 'Papa Figos DOC Douro Vinho Tinto', "7.99")
      wine.addBrand("Papa Figos")
      wine.addType("Vinho Tinto")

      const winePage = await qualityFetcher.searchForTheWine(wine)
      const quality = await qualityFetcher.getWineQualityFromPage(winePage)

      assert.equal(quality, 3.9)
    });

    it("Albenaz Escadaria Maior Quality should be 3.7", async function() {
      const wine = new Wine('6526528', 'Albenaz Escadaria Maior Premium DOC Douro Vinho Tinto', "7.99")
      wine.addBrand("Albenaz")
      wine.addType("Vinho Tinto")

      const winePage = await qualityFetcher.searchForTheWine(wine)
      const quality = await qualityFetcher.getWineQualityFromPage(winePage)

      assert.equal(quality, 3.7)
    });

    it("EA Quality should be 3.7", async function() {
      const wine = new Wine('5331018', 'EA Regional Alentejano Vinho Tinto', "5.99")
      wine.addBrand("EA")
      wine.addType("Vinho Tinto")

      const winePage = await qualityFetcher.searchForTheWine(wine)
      const quality = await qualityFetcher.getWineQualityFromPage(winePage)

      assert.equal(quality, 3.7)
    });

    it("Guarda Rios Gold Edition Quality should be 4.1", async function() {
      const wine = new Wine('6649895', 'Guarda Rios Gold Edition Regional Alentejano Vinho Tinto', "6.99")
      wine.addBrand("Guarda Rios")
      wine.addType("Vinho Tinto")

      const winePage = await qualityFetcher.searchForTheWine(wine)
      const quality = await qualityFetcher.getWineQualityFromPage(winePage)

      assert.equal(quality, 4.1)
    });

    it("Planalto Reserva Quality should be 3.7", async function() {
      const wine = new Wine('', 'Planalto Reserva DOC Douro Vinho Branco ', "5.49")
      wine.addBrand("Planalto")
      wine.addType("Vinho Branco")

      const winePage = await qualityFetcher.searchForTheWine(wine)
      const quality = await qualityFetcher.getWineQualityFromPage(winePage)

      assert.equal(quality, 3.8)
    });

    it("D Ermelinda Palmela Quality should be 3.6", async function() {
      const wine = new Wine('', 'D. Ermelinda DOC Palmela Vinho Tinto ', "5.49")
      wine.addBrand("Dona Ermelinda")
      wine.addType("Vinho Tinto")

      const winePage = await qualityFetcher.searchForTheWine(wine)
      const quality = await qualityFetcher.getWineQualityFromPage(winePage)

      assert.equal(quality, 3.6)
    });

    it("Vallegre DOC Douro Vinho Tinto Quality should be 0.0", async function() {
      const wine = new Wine('', 'Vallegre DOC Douro Vinho Tinto', "5.99")
      wine.addBrand("Vallegre")
      wine.addType("Vinho Tinto")

      const winePage = await qualityFetcher.searchForTheWine(wine)
      const quality = await qualityFetcher.getWineQualityFromPage(winePage)

      assert.equal(quality, 0)
    });

    it("Adega do Cercal Vinho Tinto Quality should be 0.0", async function() {
      const wine = new Wine('', 'Adega do Cercal Vinho Tinto', "5.89")
      wine.addBrand("Adega do Cercal")
      wine.addType("Vinho Tinto")

      const winePage = await qualityFetcher.searchForTheWine(wine)
      const quality = await qualityFetcher.getWineQualityFromPage(winePage)

      assert.equal(quality, 0)
    });
  })

  describe("validateResultWineName", function(){
    let qualityFetcher = new VivinoQualityFetcher("sample-name")

    it("Adega do Cercal Vinho Tinto should not match Adega Mayor Reserva Do Comendador Tinto", function(){
      const wine = new Wine("", "Adega do Cercal Vinho Tinto")
      wine.addBrand("Adega do Cercal")
      wine.addType("Vinho Tinto")
      assert.equal(qualityFetcher.validateResultWineName(wine, "Adega Mayor Reserva Do Comendador Tinto"), false)
    })

    it("Mula Velha Reserva Regional Lisboa Vinho Tinto should match Mula Velha Reserva", function(){
      const wine = new Wine("", "Mula Velha Reserva Regional Lisboa Vinho Tinto")
      wine.addBrand("Mula Velha")
      wine.addType("Vinho Tinto")
      assert.equal(qualityFetcher.validateResultWineName(wine, "Mula Velha Reserva"), true)
    })

    it("Papa Figos DOC Douro Vinho Tinto should match Casa Ferreirinha Papa Figos Douro", function(){
      const wine = new Wine("", "Papa Figos DOC Douro Vinho Tinto")
      wine.addBrand("Papa Figos")
      wine.addType("Vinho Tinto")
      assert.equal(qualityFetcher.validateResultWineName(wine, "Casa Ferreirinha Papa Figos Douro"), true)
    })

    it("Vallegre DOC Douro Vinho Tinto should not Vallegre Douro Reserva Especial Vinhas Velhas", function(){
      const wine = new Wine("", "Vallegre DOC Douro Vinho Tinto")
      wine.addBrand("Vallegre")
      wine.addType("Vinho Tinto")
      assert.equal(qualityFetcher.validateResultWineName(wine, "Vallegre Douro Reserva Especial Vinhas Velhas"), false)
    })
  })
});
