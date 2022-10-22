const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const axios = require("axios");
const _ = require("lodash");

async function youtubeScrappingFunction(url, res) {
  try {
    // YouTube scrapping call
    await axios
      .post("https://ssyoutube.com/api/convert", {
        url,
      })
      .then(async (result) => {
        const fullResponse = result.data;
        const videoResult = _.filter(result.data.url, function (o) {
          return (
            o.no_audio == undefined || (o.name == "MP4" && o.no_audio == false)
            // &&
            // o.attr.title == o.attr.title.match(/video format.*/)
          );
        });
        const forTheFileSize = _.filter(result.data.url, function (o) {
          return o.name == "WEBM";
        });

        let makeVideoResponse;

        if (videoResult.length > 0) {
          // let timing = await getVideoDurationInSeconds(videoResult[0].url).then(
          //   (duration) => {
          //     return duration / 60;
          //   }
          // );
          makeVideoResponse = {
            url: url,
            title: fullResponse.meta.title ? fullResponse.meta.title : null,
            thumbnail: fullResponse.thumb ? fullResponse.thumb : null,
            duration: fullResponse.meta.duration,
            source: "youtube",
          };
        }

        let staticResForTemp = [];
        await utils.asyncForEach(videoResult, async (video) => {
          let videoSize = _.find(forTheFileSize, function (obj) {
            if (obj.quality == video.quality) {
              return obj;
            }
          });

          let makeVideoInnerResponse = {
            url: video.url,
            quality: video.quality,
            extension: video.ext,
            size: videoSize.filesize ? videoSize.filesize : null,
            formattedSize: videoSize.filesize
              ? (videoSize.filesize / (1024 * 1024)).toFixed(2)
              : null,
            videoAvailable: true,
            audioAvailable: true,
          };
          staticResForTemp.push(makeVideoInnerResponse);
        });
        makeVideoResponse.medias = staticResForTemp;
        utils.sendResponse(
          res,
          200,
          messages.dataScrapped,
          makeVideoResponse
        );
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
