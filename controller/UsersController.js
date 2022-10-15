const utils = require("../utils/utils");
const { messages } = require("../utils/en");
const { table } = require("../config/tableNames");
var connection = require("../config/dbInfo");

async function usersDeviceIdAndFcm(req, res) {
  try {
    const { deviceId, fcmTnk } = req.body;

    const query = `SELECT * FROM ${table.appUsers} WHERE device_id = "${deviceId}"  ORDER BY id ASC`;
    await connection.query(query, async function (err, rows) {
      if (rows.length > 0) {
        const updateUserData = `UPDATE ${table.appUsers} SET device_id = "${deviceId}" , fcm_tkn = "${fcmTnk}" WHERE id = ${rows[0].id}`;
        await connection.query(updateUserData, function (err, rows, fields) {
          if (err)
            return utils.sendResponse(
              res,
              500,
              messages.facingIssueInAppUserUpdate,
              err
            );
          return utils.sendResponse(
            res,
            200,
            messages.appUserUpdatedSuccessful
          );
        });
      } else {
        const insertUserDataQuery = `INSERT INTO ${table.appUsers} (device_id, fcm_tkn) VALUES ("${deviceId}", "${fcmTnk}")`;
        await connection.query(
          insertUserDataQuery,
          function (err, rows, fields) {
            if (err)
              return utils.sendResponse(
                res,
                500,
                messages.facingIssueInAppUserInsert,
                err
              );
            return utils.sendResponse(
              res,
              200,
              messages.appUserInsertedSuccessful
            );
          }
        );
      }
    });
  } catch (error) {
    console.log("error: ", error);
    return utils.sendResponse(res, 400, messages.something_wrong, error);
  }
}

module.exports = {
  usersDeviceIdAndFcm,
};
