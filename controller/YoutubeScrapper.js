const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const axios = require("axios");

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

async function youtubeScrappingFunction(url, res) {
  try {
    // YouTube scrapping call
    await axios
      .post("https://ssyoutube.com/api/convert", {
        url,
      })
      .then((result) => {
        utils.sendResponse(res, 200, messages.temDataFetched, staticResForTemp);
        // utils.sendResponse(res, 200, "success", result.data.url);
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
