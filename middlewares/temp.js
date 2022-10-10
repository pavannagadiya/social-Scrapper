const utils = require("../utils/utils");
const _ = require("lodash");

const tempMiddleware = async function temp(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (_.isUndefined(header)) {
      next();
    }
  } catch (error) {
    return utils.sendResponse(res, 500, "Internal server error", error);
  }
};

module.exports = { tempMiddleware };
