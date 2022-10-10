module.exports.config = function () {
  let path;
  const env = process.env.NODE_ENV;
  if (env.trim() === "production") {
    path = "./config/prod.env";
  } else {
    path = "./config/local.env";
  }
  return path;
};
