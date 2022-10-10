const express = require("express");
const router = express.Router();
const { urlCheckMiddleware } = require("../middlewares/apiReqBodyChecker");
const instaScrapperController = require("../controller/InstaScrapper");
const youtubeScrapperController = require("../controller/youtubeScrapper");
const facebookScrapperController = require("../controller/FacebookScrapper");
const SingleController = require("../controller/SingleController");

router.get("/", urlCheckMiddleware, SingleController.SingleController);
router.get(
  "/insta-video",
  urlCheckMiddleware,
  instaScrapperController.instaVideoScrappingFunction
);
router.get(
  "/insta-photo",
  urlCheckMiddleware,
  instaScrapperController.instaPhotoScrappingFunction
);
router.get(
  "/youtube",
  urlCheckMiddleware,
  youtubeScrapperController.youtubeScrappingFunction
);
router.get(
  "/facebook",
  urlCheckMiddleware,
  facebookScrapperController.facebookPhotoScrappingFunction
);

module.exports = router;
