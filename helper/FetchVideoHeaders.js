const axios = require("axios");

async function fetchVideoSizeFromHeaders(url) {
  try {
    let size;
    await axios
      .get(url)
      .then((result) => {
        size =
          result && result.headers && result.headers["content-length"]
            ? result.headers["content-length"]
            : 1914629;
      })
      .catch((error) => {
        console.log("error: ", error);
        size = null;
      });
    return size;
  } catch (error) {
    console.log("error: ", error);
    return null;
  }
}

module.exports = {
  fetchVideoSizeFromHeaders,
};
