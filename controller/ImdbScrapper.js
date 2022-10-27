const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const dotenv = require("dotenv");
const config = require("../config/config").config();
dotenv.config({ path: config });
const puppeteer = require("puppeteer");

// Fetch instagram Video src
async function imdbVideoScrappingFunction(url, res) {
  try {
    //Virtual browser launch
    const browser = await puppeteer.launch({
      headless: false,
    });

    // Open new page in virtual browser
    const page2 = await browser.newPage();

    // fetch user agent from previous page and apply it in new page
    await page2.setUserAgent(await browser.userAgent());

    // pest destination URL and wait till the res.
    console.log("url: ", url);
    const fullPage = await page2.goto(url, {
      waitUntil: "networkidle0",
    });
    console.log("fullPage: ", fullPage);
      // Evaluate whole page
      urls = await page2.evaluate(() => {
        let results = [];
        
        // Fetch data as we want
        let items = document.querySelectorAll("img");
        
        items.forEach((item) => {
          results.push({
            url: item.src,
            alt: item.alt,
          });
        });
        return results;
      });
        console.log('urls: ', urls)

    await page2.screenshot({path: 'screenshot.png'});

    return utils.sendResponse(res, 200, messages.dataScrapped, fullPage);
  } catch (error) {
    console.log("error: ", error);
    return utils.sendResponse(res, 400, messages.something_wrong, error);
  }
}

module.exports = {
  imdbVideoScrappingFunction,
};
