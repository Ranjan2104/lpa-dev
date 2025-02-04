const getMessage = require("./message");
const { errorHandler } = require("./responseHandler");

const checkValidUser = (res, role) => {
  if (role !== "user") {
    return errorHandler({
      res,
      statusCode: 400,
      message: getMessage("M015"),
    });
  }
};

const checkValidAdminUser = (res, role) => {
  if (role === "user") {
    return errorHandler({
      res,
      statusCode: 403,
      message: getMessage("M015"),
    });
  }
};
