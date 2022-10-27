module.exports.config = function () {
  let path;
  const env = "development";
  if (env == "production") {
    path = "./config/prod.env";
  } else {
    path = "./config/local.env";
  }
  return path;
};
