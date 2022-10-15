const express = require("express");
const router = express.Router();
const {
  urlCheckMiddleware,
  deviceIdAndFcmTnkCheckMiddleware,
} = require("../middlewares/apiReqBodyChecker");
const instaScrapperController = require("../controller/InstaScrapper");
const youtubeScrapperController = require("../controller/youtubeScrapper");
const facebookScrapperController = require("../controller/FacebookScrapper");
const SingleController = require("../controller/SingleController");
const CategoryController = require("../controller/CategoryController");
const AppUsersController = require("../controller/UsersController");

// middleware to use application type
router.all("*", (req, res, next) => {
  /* if (req.headers['content-type'] !== 'application/json') {
      return errorMessage(res, 'JSON format only.', 200);
  } */
  res.setHeader("Content-Type", "application/json");
  next();
});

router.get("/", urlCheckMiddleware, SingleController.SingleController);
router.get("/get_all_category", CategoryController.getAllCategory);
router.post(
  "/user_device_info",
  deviceIdAndFcmTnkCheckMiddleware,
  AppUsersController.usersDeviceIdAndFcm
);
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
