const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const axios = require("axios");

async function youtubeScrappingFunction(url, res) {
  try {
    // YouTube scrapping call
    await axios
      .post("https://ssyoutube.com/api/convert", {
        url,
      })
      .then((result) => {
        utils.sendResponse(res, 200, "success", result.data.url);
      })
      .catch((err) => {
        console.log("err: ", err);
        return utils.sendResponse(res, 400, messages.something_wrong, err);
      });
  } catch (error) {
    console.log("error: ", error);
    return utils.sendResponse(res, 400, messages.something_wrong, error);
  }
}

module.exports = {
  youtubeScrappingFunction,
};
