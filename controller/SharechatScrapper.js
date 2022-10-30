const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const dotenv = require("dotenv");
const config = require("../config/config").config();
dotenv.config({ path: config });
const puppeteer = require("puppeteer");

const { getVideoDurationInSeconds } = require("get-video-duration");
const urlMetadata = require("url-metadata");
const { fetchVideoSizeFromHeaders } = require("../helper/FetchVideoHeaders");

// Fetch instagram Video src
async function SharechatScrappingFunction(url, res) {
  try {
    const isItImgOrVideo = url.match("https://sharechat.com/item/.*")
      ? "item"
      : "video";

    //Virtual browser launch
    const browser = await puppeteer.launch({
      headless: true,
    });

    // Open new page in virtual browser
    const page2 = await browser.newPage();
    await page2.goto(url, {
      waitUntil: "networkidle0",
    });

    if (isItImgOrVideo == "video") {
      urls = await page2.evaluate(async () => {
        let results = [];
        // Fetch data as we want
        let items = document.querySelectorAll("video");

        results.push({
          url: items[0].src,
        });
        return results;
      });
    } else {
      urls = await page2.evaluate(() => {
        let results = [];
        // Fetch data as we want
        let itemsPoster = document.querySelectorAll("img");

        results.push({
          url: itemsPoster[0].src,
          text: itemsPoster[0].alt,
        });
        return results;
      });
    }
    let timing;
    if (isItImgOrVideo == "video") {
      timing = await getVideoDurationInSeconds(urls[0].url).then((duration) => {
        return duration / 60;
      });
      let fileSizeFromSource = await fetchVideoSizeFromHeaders(urls[0].url);

      await urlMetadata(url)
        .then(async function (metadata) {
          let response = {
            url: url,
            title: metadata.title,
            thumbnail: metadata.image,
            duration: timing.toFixed(2),
            source: "sharechat",
            medias: [
              {
                url: urls[0].url,
                quality: "HD",
                extension: "mp4",
                size: fileSizeFromSource ? fileSizeFromSource : "1914629",
                formattedSize: fileSizeFromSource
                  ? (fileSizeFromSource / (1024 * 1024)).toFixed(2)
                  : "1.83 MB",
                videoAvailable: true,
                audioAvailable: true,
              },
            ],
          };
          await browser.close();

          return utils.sendResponse(res, 200, messages.dataScrapped, response);
        })
        .catch(async (error) => {
          console.error("error: ", error);
          await browser.close();
          return utils.sendResponse(res, 500, messages.something_wrong, error);
        });
    }
    await browser.close();

    return utils.sendResponse(res, 200, messages.dataScrapped, urls);
  } catch (error) {
    console.log("error: ", error);
    return utils.sendResponse(res, 400, messages.something_wrong, error);
  }
}

module.exports = {
  SharechatScrappingFunction,
};
