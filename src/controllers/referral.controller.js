const User = require("../models/user.model");
const getMessage = require("../utils/message");
const { errorHandler } = require("../utils/responseHandler");

// apply referral code
exports.applyReferralCode = async (req, res) => {
  try {
    const { referralCode, mobileNo } = req.body;
    const user = await User.findOne({ mobileNo });

    if (!user) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M002"),
      });
    }

    if (user.referedBy) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M022"),
      });
    }

    if (!referralCode) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M020"),
      });
    }

    const referredByUser = await User.findOne({
      referalCode: referralCode,
      role: "user",
      mobileNo: { $ne: mobileNo },
    });

    if (!referredByUser) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M021"),
      });
    }

    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M023"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};
