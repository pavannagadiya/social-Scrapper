const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "127.0.0.1", // host for connection
  // ort: 3302, // default port for mysql is 3306
  database: "media_share_360", // database from which we want to connect out node application
  user: "root", // username of the mysql connection
  password: "", // password of the mysql connection
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

module.exports = connection;
