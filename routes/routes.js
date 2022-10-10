const express = require("express");
const router = express.Router();
const { tempMiddleware } = require("../middlewares/temp");
const instaScrapperController = require("../controller/InstaScrapper");
const youtubeScrapperController = require("../controller/youtubeScrapper");
const facebookScrapperController = require("../controller/FacebookScrapper");

router.get(
  "/insta-video",
  tempMiddleware,
  instaScrapperController.instaVideoScrappingFunction
);
router.get(
  "/insta-photo",
  tempMiddleware,
  instaScrapperController.instaPhotoScrappingFunction
);
router.get(
  "/youtube",
  tempMiddleware,
  youtubeScrapperController.youtubeScrappingFunction
);
router.get(
  "/facebook",
  tempMiddleware,
  facebookScrapperController.facebookVideoScrappingFunction
);

module.exports = router;
