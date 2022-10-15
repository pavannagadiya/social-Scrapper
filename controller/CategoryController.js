const utils = require("../utils/utils");
const { messages } = require("../utils/en");
var connection = require("../config/dbInfo");
const { table } = require("../config/tableNames");

async function getAllCategory(req, res) {
  try {
    const query = `SELECT * FROM ${table.mediaCategories} ORDER BY id ASC`;
    await connection.query(query, function (err, rows) {
      if (err)
        return utils.sendResponse(
          res,
          500,
          messages.facingSomeIssueCategory,
          err
        );
      return utils.sendResponse(res, 200, messages.fetchAllCategory, rows);
    });
  } catch (error) {
    console.log("error: ", error);
    return utils.sendResponse(res, 400, messages.something_wrong, error);
  }
}

module.exports = {
  getAllCategory,
};
