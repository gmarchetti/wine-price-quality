import puppeteer from 'puppeteer';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://www.continente.pt/produto/mula-velha-reserva-regional-lisboa-vinho-tinto-mula-velha-5400380.html');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

//   await page.screenshot( {path: "screenshot.png"})
//   let price
//   page.$$("ct-price-formatted")
//     .then((result) => console.log(result))
//     .catch((err) => console.log(err))
//     .finally(() => {
//         console.log("Process Finished")
//         browser.close()
//         console.log("Browser Closed")
//     })
  
let price_wrapper = await page.$eval(".prices-wrapper > .sales > .value", (element) => {
    return element.getAttribute("content")
})

console.log(price_wrapper)

await browser.close()

})();