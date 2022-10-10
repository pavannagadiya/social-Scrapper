const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const dotenv = require("dotenv");
const config = require("../config/config").config();
dotenv.config({ path: config });
const puppeteer = require("puppeteer");
const fs = require("fs");

const { fbEmailId, fbPassword } = process.env;

async function facebookVideoScrappingFunction(req, res) {
  try {
    // Read the cookie
    let cookies = await readCookies();

    if (cookies === undefined) {
      await setFacebookCookies();
      cookies = await readCookies();
    }

    if (cookies === undefined) {
      return utils.sendResponse(res, 400, "Please check cookie");
    }

    //Virtual browser launch
    const browser = await puppeteer.launch({
      headless: true,
    });

    // Open new page in virtual browser
    const page2 = await browser.newPage();

    // set cookies
    await page2.setCookie(...JSON.parse(cookies));

    await page2.goto("https://fb.watch/fSzdkh6bwg/", {
      waitUntil: "networkidle0",
    });

    // Just took a snap of current page from browser
    await page2.screenshot({ path: "GFG2.png" });

    // Evaluate whole page
    let urls = await page2.evaluate(() => {
      let results = [];

      // Fetch data as we want
      let items = document.querySelectorAll("video");

      items.forEach((item) => {
        results.push({
          url: item.src,
          text: item.alt,
        });
      });
      return results;
    });
    // return urls;
    utils.sendResponse(res, 200, "success", urls);

    // Close virtual browser
    return await browser.close();
  } catch (error) {
    console.log("error: ", error);
    return utils.sendResponse(res, 400, messages.something_wrong, error);
  }
}

// Generate facebook cookie and add in our local project
async function setFacebookCookies() {
  try {
    //Virtual browser launch
    const browser = await puppeteer.launch();

    // New tab in virtual browser
    const page = await browser.newPage();

    // Pest URL which we want to open

    /*
     * Here in our case we are first open insta. login page
     * And fetch username input and password input from the page
     * Add personal instagram credentials and the hit submit button
     */
    await page.goto("https://www.facebook.com/login", {
      waitUntil: "networkidle0",
    });

    // Just took a snap of current page from browser
    await page.screenshot({ path: "FB1.png" });

    // Fetch inputs and buttons wait here till it found
    await Promise.all([
      page.waitForSelector('input[name="email"]'),
      page.waitForSelector('input[name="pass"]'),
      page.waitForSelector('button[type="submit"]'),
    ]);

    // Just took a snap of current page from browser
    await page.screenshot({ path: "FB2.png" });

    // Pass credentials
    await page.type('input[name="email"]', fbEmailId);
    await page.type('input[name="pass"]', fbPassword);

    // Hit the submit button
    await page.click('button[type="submit"]');

    // Just took a snap of current page from browser
    await page.screenshot({ path: "FB3.png" });

    // Wait untill responce
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    // Just took a snap of current page from browser
    await page.screenshot({ path: "FB4.png" });

    // Get cookies
    const cookies = await page.cookies();

    console.log("cookies: ", cookies);

    // Store cookies for future use.
    fs.writeFileSync("facebook_cookies.json", JSON.stringify(cookies), "utf-8");
    await browser.close();
    return true;
  } catch (error) {
    console.log("error: ", error);
    return false;
  }
}

async function readCookies() {
  try {
    if (fs.existsSync("./facebook_cookies.json")) {
      const data = fs.readFileSync("./facebook_cookies.json", {
        encoding: "utf8",
        flag: "r",
      });
      return data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log("error: ", error);
    return error;
  }
}

module.exports = {
  facebookVideoScrappingFunction,
};
