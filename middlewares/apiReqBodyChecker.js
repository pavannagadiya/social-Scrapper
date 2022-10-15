const utils = require("../utils/utils");
const _ = require("lodash");

const urlCheckMiddleware = async function urlChecker(req, res, next) {
  try {
    const header = req.headers.authorization;
    const { url } = req.body;
    if (_.isUndefined(header) && !_.isUndefined(url)) {
      next();
    } else {
      return utils.sendResponse(res, 400, "URL required!");
    }
  } catch (error) {
    return utils.sendResponse(res, 500, "Internal server error", error);
  }
};
const deviceIdAndFcmTnkCheckMiddleware =
  async function deviceIdAndFcmTnkChecker(req, res, next) {
    try {
      const header = req.headers.authorization;
      const { deviceId, fcmTnk } = req.body;
      if (
        _.isUndefined(header) &&
        !_.isUndefined(fcmTnk) &&
        !_.isUndefined(deviceId)
      ) {
        next();
      } else {
        return utils.sendResponse(
          res,
          400,
          "Device Id and FCM Token is required."
        );
      }
    } catch (error) {
      return utils.sendResponse(res, 500, "Internal server error", error);
    }
  };

module.exports = { urlCheckMiddleware, deviceIdAndFcmTnkCheckMiddleware };
