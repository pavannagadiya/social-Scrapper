const url = require("url");
const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const instaScrapperController = require("../controller/InstaScrapper");
const youtubeScrapperController = require("../controller/YoutubeScrapper");
const facebookScrapperController = require("../controller/FacebookScrapper");
const ImdbScrapperController = require("../controller/ImdbScrapper");
const SharechatScrapperController = require("../controller/SharechatScrapper");

async function SingleController(req, res) {
  try {
    // Fetch URL from request
    const { url } = req.body;
    const newUrl = new URL(url);

    // Fetch hostname from URL remove extra dots
    const hostName = newUrl.host.replace(/www.|.com|\./g, "");

    // Check are we provide this service or not
    const areWeProvideThisService = utils.weProvideServices.includes(hostName);

    if (!areWeProvideThisService) {
      return utils.sendResponse(res, 400, messages.weAreNotProvideThisService);
    }

    let scrappedData;

    // Based on host name call function
    switch (hostName) {
      case "youtube":
        scrappedData = await youtubeScrapperController.youtubeScrappingFunction(
          url,
          res
        );
        break;
      case "facebook":
        scrappedData =
          await facebookScrapperController.facebookPhotoScrappingFunction(
            url,
            res
          );
        break;
      case "instagram":
        scrappedData =
          await instaScrapperController.instaVideoScrappingFunction(url, res);
        break;
      case "imdb":
        scrappedData = ImdbScrapperController.imdbVideoScrappingFunction(
          url,
          res
        );
        break;
      case "sharechat":
        scrappedData =
          await SharechatScrapperController.SharechatScrappingFunction(
            url,
            res
          );
        break;
    }

    return scrappedData;
  } catch (error) {
    console.log("error: ", error);
    return utils.sendResponse(res, 500, messages.something_wrong, error);
  }
}

module.exports = {
  SingleController,
};
