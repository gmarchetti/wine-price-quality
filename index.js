import puppeteer from 'puppeteer';
import SingleItemParser from "./parsers/ct-single-item-parser.js"

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://www.continente.pt/produto/mula-velha-reserva-regional-lisboa-vinho-tinto-mula-velha-5400380.html');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});
  
let parser = new SingleItemParser(page)

let price = await parser.getPrice()
console.log(price)

await browser.close()

})();