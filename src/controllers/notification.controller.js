const Notification = require("../models/notifications.model");
const User = require("../models/user.model");
const getMessage = require("../utils/message");
const { errorHandler, successHandler } = require("../utils/responseHandler");

// send notification to user by admin or superadmin
exports.sendNotificationByAdmin = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { message, title, userId } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M002"),
      });
    }

    await Notification.create({ message, title, userId });

    return successHandler({
      res,
      statusCode: 201,
      message: getMessage("M031"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

//delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M002"),
      });
    }
    const { notificationId } = req.params;
    await Notification.deleteOne({ _id: notificationId });
    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M032"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

//get notifications
exports.getNotifications = async (req, res) => {
  try {
    const { role, _id } = req.user;
    const { data } = req.query;
    const filter = {};
    if (role === "user") {
      filter.userId = _id;
    } else {
      if (data !== "all") {
        const user = await User.findOne({ _id: data });
        if (!user) {
          return errorHandler({
            res,
            statusCode: 400,
            message: getMessage("M002"),
          });
        }
        filter.userId = data;
      }
    }

    const notifications = await Notification.find(filter);
    return successHandler({
      res,
      data: notifications,
      statusCode: 200,
      message: getMessage("M033"),
    });
  } catch (error) {
    return errorHandler({
      res,
      statusCode: 500,
      message: error.message,
    });
  }
};
