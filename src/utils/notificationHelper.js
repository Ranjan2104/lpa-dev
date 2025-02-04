const Notification = require("../models/notifications.model");

// welcome notification
const welComeNotification = async (userId) => {
  try {
    if (!userId) return;
    await Notification.create({
      userId: userId,
      message: "Welcome to the R1 Battle",
      title: "welcome!",
    });
  } catch (err) {
    console.log(err);
  }
};

// user referred notification
const sendReferralNotification = async (refferedByUserId, mobileNo) => {
  //userId:- referred user
  //refferedUserId:- user who referred
  try {
    if (!refferedByUserId && !mobileNo) return;
    await Notification.create({
      userId: refferedByUserId,
      message: "You have successfully referred " + mobileNo,
      title: "Referral",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { welComeNotification, sendReferralNotification };
