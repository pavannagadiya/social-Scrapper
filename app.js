const express = require("express");
const app = express();
const dotenv = require("dotenv");
const config = require("./config/config").config();
dotenv.config({ path: config });
const router = require("./routes/routes");
const cors = require("cors");
var http = require("http").Server(app);
const bodyParser = require('body-parser');


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/", router);

const port = process.env.PORT || "3000";
http.listen(port, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
