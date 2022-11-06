const url = require("url");
const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const { table } = require("../config/tableNames");
const _ = require("lodash");
var { connection } = require("../config/dbInfo");
var {
  validateEmail,
  phoneNumber,
  phoneNumber,
} = require("../helper/Validator");

async function feedbackController(req, res) {
  try {
    const { name, email, phone, feedback } = req.body;

    if (
      name == "" ||
      _.isUndefined(name) ||
      email == "" ||
      _.isUndefined(email) ||
      feedback == "" ||
      _.isUndefined(feedback)
    ) {
      return utils.sendResponse(res, 400, messages.checkFeedBackFields, error);
    }

    const emailChecker = await validateEmail(email);
    const phoneNumberChecker = await phoneNumber(phone);
    if (!emailChecker) {
      return utils.sendResponse(res, 400, messages.checkEmail);
    }
    if (
      (phone != "" || !_.isUndefined(phone)) &&
      (!phoneNumberChecker || phoneNumberChecker.length < 10)
    ) {
      return utils.sendResponse(res, 400, messages.checkPhone);
    }

    const insertFeedbackDataQuery = `INSERT INTO ${
      table.feedback
    } (name, email, phone, feedback) VALUES ("${name}", "${email}","${
      phone == "" || _.isUndefined(phone) ? null : phone
    }", "${feedback}")`;
    await connection.query(
      insertFeedbackDataQuery,
      function (err, rows, fields) {
        if (err)
          return utils.sendResponse(
            res,
            500,
            messages.facingIssueInFeedbackInsert,
            err
          );
        return utils.sendResponse(res, 200, messages.feedbackAddedSuccessFul);
      }
    );
  } catch (error) {
    console.log("error: ", error);
    return utils.sendResponse(res, 500, messages.something_wrong, error);
  }
}

module.exports = { feedbackController };
