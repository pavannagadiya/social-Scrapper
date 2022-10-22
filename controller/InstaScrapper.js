const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const dotenv = require("dotenv");
const config = require("../config/config").config();
dotenv.config({ path: config });
const { instaUserName, instaPassword } = process.env;
const puppeteer = require("puppeteer");

const { getVideoDurationInSeconds } = require("get-video-duration");
const urlMetadata = require("url-metadata");

// const cookiesTxt = require("../cookies.txt");

const fs = require("fs");

const staticResForTemp = {
  url: "https://www.youtube.com/watch?v=QdkQfx4xvm0",
  title:
    "Bella – Heartbreak Is Natural (Official Music Video) | Found Out Records",
  thumbnail: "https://i.ytimg.com/vi/QdkQfx4xvm0/mqdefault.jpg",
  duration: "03:25",
  source: "youtube",
  medias: [
    {
      url: "https://redirector.googlevideo.com/videoplayback?expire=1665483126&ei=Fu1EY7P9M4qDhgaVxqzwBA&ip=67.207.95.27&id=o-AJt2VC3GyZ7v61yZRQRabJQfTEgAD_6dqTijJxILIvaa&itag=17&source=youtube&requiressl=yes&mh=bX&mm=31%2C26&mn=sn-ab5l6nrk%2Csn-p5qddn76&ms=au%2Conr&mv=m&mvi=4&pl=24&gcr=us&initcwndbps=795000&vprv=1&mime=video%2F3gpp&gir=yes&clen=1914629&dur=205.496&lmt=1663049353671496&mt=1665461137&fvip=5&fexp=24001373%2C24007246&c=ANDROID&txp=5532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRgIhAOz4YwouWi_X1eiMTFBl110pas85xDzgeHlyiPEPqGlCAiEA04BkBghGDSFL7Bnikwe0nc0rmajkqyFcw7so9uevz-I%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhALx8XrbVfZrqhplkFEWhpSuF9acXQCbKFXdPOPz6N2ajAiEA_6WSsakUD3bjAFT_XshWf4u2RFMD9JXyQOlQl-3u0vs%3D",
      quality: "144p",
      extension: "3gp",
      size: "1914629",
      formattedSize: "1.83 MB",
      videoAvailable: true,
      audioAvailable: true,
    },
  ],
};

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

    if (isItImgOrVideo != "img") {
      let timing = await getVideoDurationInSeconds(urls[0].url).then(
        (duration) => {
          return duration / 60;
        }
      );

      const meta = await urlMetadata(url).then(
        function (metadata) {
          // success handler
          return metadata;
        },
        function (error) {
          // failure handler
          console.log(error);
          return null;
        }
      );

      const videoResponse = {
        url: url,
        title: meta.title ? meta.title : null,
        thumbnail: meta.poster ? meta.poster : null,
        duration: timing.toFixed(2),
        source: "instagrame",
        medias: [
          {
            url: urls[0].url,
            quality: "hd",
            extension: "hd",
            size: "1914629",
            formattedSize: "1.83 MB",
            videoAvailable: true,
            audioAvailable: true,
          },
        ],
      };

      return utils.sendResponse(
        res,
        200,
        messages.dataScrapped,
        videoResponse
      );
    }

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
