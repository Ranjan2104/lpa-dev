const errorHandler = ({ res, statusCode, message }) => {
  return res.status(statusCode).json({
    status: "error",
    statusCode: statusCode,
    message,
  });
};

const successHandler = ({ res, data = null, statusCode, message }) => {
  return res.status(statusCode).json({
    statusCode: statusCode,
    status: "success",
    data,
    message,
  });
};

module.exports = { errorHandler, successHandler };
