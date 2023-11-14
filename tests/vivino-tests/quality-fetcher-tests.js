import assert, { doesNotMatch } from 'assert';
import path from 'path'
import VivinoQualityFetcher from "../../models/vivino-item-fetcher/vivino-quality-fetcher.js"
import SearchBrowser from '../../models/puppeteer/search-browser.js';

describe('VivinoQualityFetcher', function () {

  describe('getWineQuality()', function() {
    let qualityFetcher = new VivinoQualityFetcher("sample-name")
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

    afterEach(async function(){
        browser.closeSearchPage()
        winePage = null
    });
  });
});
