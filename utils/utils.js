function sendResponse(res, statusCode, message, data) {
  let obj;
  if (data) {
    obj = {
      code: statusCode,
      message: message,
      data: data,
    };
  } else {
    obj = {
      code: statusCode,
      message: message,
    };
  }
  return res.status(statusCode).json(obj);
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const weProvideServices = ["youtube", "facebook", "instagram"];

module.exports = {
  sendResponse,
  asyncForEach,
  weProvideServices,
};
