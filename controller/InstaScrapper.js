const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const dotenv = require("dotenv");
const config = require("../config/config").config();
dotenv.config({ path: config });
const { instaUserName, instaPassword } = process.env;
const puppeteer = require("puppeteer");

// const cookiesTxt = require("../cookies.txt");

const fs = require("fs");

// Fetch instagram Video src
async function instaVideoScrappingFunction(url, res) {
  try {
    // Read the cookie
    let cookieFromFile = await readCookies();

    if (cookieFromFile === undefined) {
      await setNewInstaCookie();
      cookieFromFile = await readCookies();
    }

    if (cookieFromFile === undefined) {
      return utils.sendResponse(res, 400, "Please check cookie");
    }

    //Virtual browser launch
    const browser = await puppeteer.launch({
      headless: true,
    });

    // Open new page in virtual browser
    const page2 = await browser.newPage();

    // set cookies
    await page2.setCookie(...JSON.parse(cookieFromFile));

    // fetch user agent from previous page and apply it in new page
    await page2.setUserAgent(await browser.userAgent());

    // pest destination URL and wait till the res.
    await page2.goto(url, {
      waitUntil: "networkidle0",
    });

    const isItImgOrVideo = url.match("https://www.instagram.com/p/.*")
      ? "img"
      : "video";

    let urls;
    if (isItImgOrVideo == "img") {
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
    } else {
      // Evaluate whole page
      urls = await page2.evaluate(() => {
        let results = [];

        // Fetch data as we want
        let items = document.querySelectorAll("video");

        items.forEach((item) => {
          results.push({
            url: item.src,
            poster: item.poster,
          });
        });
        return results;
      });
    }

    // Close virtual browser
    await browser.close();

    // return urls;
    return utils.sendResponse(
      res,
      200,
      messages.dataScrapped,
      isItImgOrVideo == "img" ? urls[0] : urls
    );
  } catch (error) {
    console.log("error: ", error);
    return utils.sendResponse(res, 400, messages.something_wrong, error);
  }
}

// Fetch instagram image src
async function instaPhotoScrappingFunction(url, res) {
  try {
    // Read the cookie
    let cookieFromFile = await readCookies();

    if (cookieFromFile === undefined) {
      await setNewInstaCookie();
      cookieFromFile = await readCookies();
    }

    if (cookieFromFile === undefined) {
      return utils.sendResponse(res, 400, "Please check cookie");
    }

    //Virtual browser launch
    const browser = await puppeteer.launch({
      headless: true,
    });

    // Open new page in virtual browser
    const page2 = await browser.newPage();

    // set cookies
    await page2.setCookie(...JSON.parse(cookieFromFile));

    // fetch user agent from previous page and apply it in new page
    await page2.setUserAgent(await browser.userAgent());

    // pest destination URL and wait till the res.
    await page2.goto(
      url,
      // "https://www.instagram.com/p/COeWvqhpwx_iQR7LhRvd-XZG4zFuonS7w6bs2Q0/?igshid=NzNkNDdiOGI=",
      {
        waitUntil: "networkidle0",
      }
    );

    // Evaluate whole page
    let urls = await page2.evaluate(() => {
      let results = [];

      // Fetch data as we want
      let items = document.querySelectorAll("img");

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

async function setNewInstaCookie() {
  try {
    //Virtual browser launch
    const browser = await puppeteer.launch();

    // New tab in virtual browser
    const page = await browser.newPage();

    // Pass URL which we want to open

    /*
     * Here in our case we are first open insta. login page
     * And fetch username input and password input from the page
     * Add personal instagram credentials and the hit submit button
     */
    await page.goto("https://www.instagram.com/accounts/login/", {
      waitUntil: "networkidle0",
    });

    // Fetch inputs and buttons wait here till it found
    await Promise.all([
      page.waitForSelector('input[name="username"]'),
      page.waitForSelector('input[name="password"]'),
      page.waitForSelector('button[type="submit"]'),
    ]);

    // Pass credentials
    await page.type('input[name="username"]', instaUserName);
    await page.type('input[name="password"]', instaPassword);

    // Hit the submit button
    await page.click('button[type="submit"]');

    // Wait untill responce
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    // Get cookies
    const cookies = await page.cookies();

    // Open new page in virtual browser
    const page2 = await browser.newPage();

    // set cookies
    await page2.setCookie(...cookies);

    // fetch user agent from previous page and apply it in new page
    await page2.setUserAgent(await browser.userAgent());

    // pest destination URL and wait till the res.
    await page2.goto("https://www.instagram.com", {
      waitUntil: "networkidle0",
    });

    // Store cookies for future use.
    fs.writeFileSync(
      "instagram_cookies.json",
      JSON.stringify(cookies),
      "utf-8"
    );

    await browser.close();
    return true;
  } catch (error) {
    console.log("error: ", error);
    return false;
  }
}

async function readCookies() {
  try {
    if (fs.existsSync("./instagram_cookies.json")) {
      const data = fs.readFileSync("./instagram_cookies.json", {
        encoding: "utf8",
        flag: "r",
      });
      return data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log("error: ", error);
    return false;
  }
}

module.exports = {
  instaVideoScrappingFunction,
  instaPhotoScrappingFunction,
};
