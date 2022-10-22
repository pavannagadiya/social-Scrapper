const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost", // host for connection
  // ort: 3302, // default port for mysql is 3306
  database: "mediashare", // database from which we want to connect out node application
  user: "mediashare", // username of the mysql connection
  password: "cV4VB1D9yTr2vvxUaWF3", // password of the mysql connection
});

// connection.on("error", function (err) {
//   console.log(err.code); // 'ER_BAD_DB_ERROR'
// });
connection.connect(function (err) {
  if (err) {
    return console.log("Please connect the DB !");
  }
  console.log("Database is connected successfully !");
});

const domainName = "https://frontend.sharebuddy.ml/";
const categoryPath = "/public/images/media_categories/";

module.exports = { connection, domainName, categoryPath };
