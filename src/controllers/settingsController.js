const Battle = require("../models/battle.model");
const Settings = require("../models/settings.model");
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const Notification = require("../models/notifications.model");
const getMessage = require("../utils/message");
const { errorHandler, successHandler } = require("../utils/responseHandler");
const BattleCommission = require("../models/battleCommission.model");
const {
  changeDateTimeToNight,
  changeDateTimeToNightAfter,
} = require("../utils/dateHelper");

// update social media links
exports.updateSocialMediaLinks = async (req, res) => {
  try {
    const { role } = req.user;
    const { whatsAppLink, facebookLink, instagramLink, telegramLink } =
      req.body;

    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }

    const updateObject = {
      ...(whatsAppLink && { whatsAppLink }),
      ...(facebookLink && { facebookLink }),
      ...(instagramLink && { instagramLink }),
      ...(telegramLink && { telegramLink }),
    };

    if (Object.keys(updateObject).length === 0) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M026"),
      });
    }

    const updatedSettings = await Settings.updateOne(
      {},
      { $set: updateObject }
    );

    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M027"),
      data: updatedSettings,
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

// update referral amount percentage
exports.updateReferralAmountPercentage = async (req, res) => {
  try {
    const { role } = req.user;
    const { referralAmountPercentage } = req.body;

    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }

    const updateObject = {
      ...(referralAmountPercentage && { referralAmountPercentage }),
    };

    const updatedSettings = await Settings.updateOne(
      {},
      { $set: updateObject }
    );

    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M028"),
      data: updatedSettings,
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

// update payment setting
exports.updatePaymentSetting = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { upiId, upiQrCode } = req.body;
    const updatedSettings = await Settings.updateOne(
      {},
      { $set: { upiId, upiQrCode } }
    );
    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M050"),
      data: updatedSettings,
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

//approve kyc by admin
exports.approveKYC = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M002"),
      });
    }

    user.name = user.kycDocument.name;
    user.isKYCVerified = true;
    user.save();

    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M049"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

// reject kyc by admin
exports.rejectKYC = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M002"),
      });
    }
    await User.findOneAndUpdate(
      { _id: userId },
      {
        isKYCVerified: false,
        kycDocument: {
          aadharNumber: null,
          name: null,
          frontPhoto: null,
          backPhoto: null,
        },
      },
      { new: true }
    );
    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M069"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

// get settings config
exports.getSettingsConfig = async (req, res) => {
  try {
    const data = await Settings.findOne({});
    return successHandler({
      res,
      statusCode: 200,
      data: data,
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.getUsersList = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const users = await User.find(
      { role: "user", isActive: true },
      { _id: 1, name: 1, mobileNo: 1 }
    );
    return successHandler({
      res,
      message: getMessage("M058"),
      statusCode: 200,
      data: users,
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.getUnverifiedUsersList = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }

    const users = await User.find(
      { role: "user", isActive: true, isKYCVerified: false },
      { _id: 1, mobileNo: 1, kycDocument: 1 }
    );
    const usersList = users?.filter((user) => user?.kycDocument?.aadharNumber);
    return successHandler({
      res,
      message: getMessage("M059"),
      statusCode: 200,
      data: usersList,
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.adminDashboard = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { fromDate, toDate } = req.query;

    const dateFilter =
      fromDate && toDate
        ? {
            createdAt: {
              $gte: changeDateTimeToNight(new Date(fromDate)),
              $lte: changeDateTimeToNightAfter(new Date(toDate)),
            },
          }
        : {};

    const getCount = async (model, filter) =>
      await model.countDocuments(filter);

    const getAggregateTotal = async (model, match, field) => {
      const result = await model.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: `$${field}` } } },
      ]);
      return result[0]?.total || 0;
    };

    const [
      totalUsers,
      activeUsers,
      blockedUsers,
      totalAdmins,
      activeAdmins,
      blockedAdmins,
      totalTransactions,
      totalDeposits,
      totalWithdrawals,
      totalBattle,
      activeBattles,
      ongoingBattles,
      cancelledBattles,
      completedBattles,
      pendingDepositTransaction,
      rejectedDepositRequest,
      pendingWithdrawalTransaction,
      rejectedWithdrawalRequest,
      totalWithdraw,
      totalCommission,
      totalReferral,
      totalBonus,
      totalPenalty,
      totalWithdrawRequest,
      totalReferralAmountUser,
    ] = await Promise.all([
      getCount(User, { role: "user", isVerified: true, ...dateFilter }),
      getCount(User, {
        role: "user",
        isVerified: true,
        isActive: true,
        ...dateFilter,
      }),
      getCount(User, {
        role: "user",
        isVerified: true,
        isActive: false,
        ...dateFilter,
      }),
      getCount(User, { role: "admin", ...dateFilter }),
      getCount(User, { role: "admin", isActive: true, ...dateFilter }),
      getCount(User, { role: "admin", isActive: false, ...dateFilter }),
      getCount(Transaction, {
        type: "deposit",
        status: "approved",
        isReferral: false,
        isBattleTransaction: false,
        isWonCash: false,
        ...dateFilter,
      }),
      getAggregateTotal(
        Transaction,
        {
          type: "deposit",
          status: "approved",
          isReferral: false,
          isBattleTransaction: false,
          isWonCash: false,
          ...dateFilter,
        },
        "amount"
      ),
      getAggregateTotal(
        Transaction,
        {
          type: "withdraw",
          status: "approved",
          isReferral: false,
          ...dateFilter,
        },
        "amount"
      ),
      getCount(Battle, { ...dateFilter }),
      getCount(Battle, { status: "PLAYING", ...dateFilter }),
      getCount(Battle, {
        status: "PLAYING",
        isBattleRequestAccepted: true,
        ...dateFilter,
      }),
      getCount(Battle, {
        status: "CLOSED",
        matchStatus: "CANCELLED",
        ...dateFilter,
      }),
      getCount(Battle, {
        status: "CLOSED",
        matchStatus: "COMPLETED",
        ...dateFilter,
      }),
      getCount(Transaction, {
        status: "pending",
        type: "deposit",
        ...dateFilter,
      }),
      getCount(Transaction, {
        status: "rejected",
        type: "deposit",
        ...dateFilter,
      }),
      getCount(Transaction, {
        status: "pending",
        type: "withdraw",
        ...dateFilter,
      }),
      getCount(Transaction, {
        status: "rejected",
        type: "withdraw",
        ...dateFilter,
      }),
      getAggregateTotal(
        Transaction,
        {
          type: "withdraw",
          isBattleTransaction: false,
          status: "approved",
          ...dateFilter,
        },
        "amount"
      ),
      getAggregateTotal(BattleCommission, { ...dateFilter }, "amount"),
      getAggregateTotal(
        Transaction,
        {
          type: "deposit",
          isReferral: true,
          isBattleTransaction: true,
          ...dateFilter,
        },
        "amount"
      ),
      getAggregateTotal(
        Transaction,
        { type: "bonus", ...dateFilter },
        "amount"
      ),
      getAggregateTotal(
        Transaction,
        { type: "penalty", ...dateFilter },
        "amount"
      ),
      getCount(Transaction, {
        type: "withdraw",
        isBattleTransaction: false,
        ...dateFilter,
      }),
      getAggregateTotal(
        Transaction,
        {
          type: "referral",
          isReferral: true,
          status: "approved",
          ...dateFilter,
        },
        "amount"
      ),
    ]);

    const userBalances = await User.find(
      { role: "user", isActive: true, ...dateFilter },
      { balance: 1 }
    );

    const userBalancesForReferral = await User.find(
      { role: "user", isActive: true },
      { balance: 1 }
    );

    const totalWalletBalance = userBalancesForReferral.reduce(
      (total, user) => total + user.balance.totalWalletBalance,
      0
    );

    const pendingReferralAmount = userBalancesForReferral.reduce(
      (total, user) => total + user.balance.referralEarning,
      0
    );

    const holdUserBalances = await User.find(
      { role: "user", isActive: false },
      { balance: 1 }
    );
    const holdBalance = holdUserBalances.reduce(
      (total, user) => total + user.balance.totalBalance + user.balance.cashWon,
      0
    );

    const data = {
      totalUsers,
      activeUsers,
      blockedUsers,
      totalAdmins,
      activeAdmins,
      blockedAdmins,
      totalTransactions,
      totalDeposits,
      totalWithdrawals,
      totalBattle,
      activeBattles,
      ongoingBattles,
      cancelledBattles,
      completedBattles,
      pendingDepositTransaction,
      rejectedDepositRequest,
      pendingWithdrawalTransaction,
      rejectedWithdrawalRequest,
      totalWithdraw,
      totalCommission,
      totalReferral,
      totalBonus,
      totalWalletBalance,
      pendingReferralAmount,
      holdBalance,
      totalPenalty,
      totalWithdrawRequest,
      totalReferralAmountUser,
    };

    return successHandler({
      res,
      statusCode: 200,
      data,
      message: getMessage("M060"),
    });
  } catch (err) {
    return errorHandler({ res, statusCode: 500, message: err.message });
  }
};

exports.blockOrUnblockUsers = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { userId, block } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M002"),
      });
    }
    await User.findOneAndUpdate(
      { _id: userId },
      { isActive: !block },
      { new: true }
    );
    return successHandler({
      res,
      statusCode: 200,
      message: getMessage(block ? "M061" : "M064"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.penalty = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { userId, amount, reason } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M002"),
      });
    }
    if (user.balance.totalWalletBalance < amount) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M043"),
      });
    }

    if (user.balance.totalBalance < amount) {
      const diff = amount - user.balance.totalBalance;
      user.balance.totalBalance = 0;
      user.balance.cashWon -= diff;
    } else {
      user.balance.totalBalance -= amount;
    }

    user.balance.totalWalletBalance -= amount;

    await Transaction.create({
      type: "penalty",
      userId,
      amount: amount,
      status: "approved",
      closingBalance: user.balance.totalWalletBalance,
    });

    user.balance.penalty += amount;
    user.save();

    if (reason) {
      await Notification.create({
        userId,
        message: `You have been penalized for ${reason}`,
        title: "Penalty",
      });
    }

    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M062"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.getAllUsersList = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const users = await User.find(
      { role: "user", isVerified: true },
      { _id: 1, name: 1, mobileNo: 1, createdAt: 1, isActive: 1 }
    );
    return successHandler({
      res,
      message: getMessage("M058"),
      statusCode: 200,
      data: users,
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.addBonus = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { userId, amount } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M002"),
      });
    }

    user.balance.totalWalletBalance += amount;

    await Transaction.create({
      type: "bonus",
      userId,
      amount,
      status: "approved",
      closingBalance: user.balance.totalWalletBalance,
    });

    user.balance.totalBalance += amount;
    user.balance.bonus += amount;
    user.save();

    await Notification.create({
      userId,
      message: `You have received ${amount} bonus`,
      title: "Bonus",
    });

    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M066"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.uploadKYCDocument = async (req, res) => {
  try {
    const { _id, role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { mobileNo, aadharNumber, name, frontPhoto, backPhoto } = req.body;

    // Update user KYC document data
    const updatedUser = await User.findOneAndUpdate(
      { mobileNo, isActive: true },
      {
        $set: {
          kycDocument: {
            aadharNumber,
            name,
            frontPhoto,
            backPhoto,
          },
          isKYCVerified: true,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return errorHandler({
        res,
        statusCode: 400,
        message: "User not found or update failed",
      });
    }

    return successHandler({
      res,
      statusCode: 200,
      message: "KYC document uploaded successfully",
    });
  } catch (error) {
    return errorHandler({
      res,
      statusCode: 500,
      message: error.message,
    });
  }
};

exports.updateBattleEarningPercentage = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }
    const { percentage } = req.body;

    await Settings.updateOne(
      {},
      {
        $set: {
          battleEarningPercentage: percentage,
        },
      }
    );

    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M067"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "user") {
      return errorHandler({
        res,
        statusCode: 403,
        message: getMessage("M015"),
      });
    }

    const { userId } = req.params;

    // Fetch all required data in parallel
    const [
      user,
      depositHistory,
      withdrawHistory,
      referralHistory,
      battleTransactions,
      battleWonTransactions,
      referralTransactions,
      referralDepositTransactions,
      battles,
    ] = await Promise.all([
      User.findById(userId)
        .populate("referedBy", "name")
        .populate("referredUsers.userId", "name")
        .lean(),
      Transaction.find({
        userId,
        type: "deposit",
        isReferral: false,
        isWonCash: false,
        isBattleTransaction: false,
      })
        .sort({ createdAt: -1 })
        .lean(),
      Transaction.find({
        userId,
        type: "withdraw",
        isReferral: false,
        isWonCash: false,
        isBattleTransaction: false,
      })
        .sort({ createdAt: -1 })
        .lean(),
      Transaction.find({ userId, type: "referral", isReferral: true })
        .sort({ createdAt: -1 })
        .lean(),
      Transaction.find({
        userId,
        type: "withdraw",
        isBattleTransaction: true,
      }).populate("battleId"),
      Transaction.find({
        userId,
        type: "deposit",
        isBattleTransaction: true,
        isWonCash: true,
      }),
      Transaction.find({
        userId,
        type: "deposit",
        isReferral: true,
      }),
      Transaction.find({
        userId,
        type: "referral",
        isReferral: true,
      }),
      Battle.find({
        $or: [{ createdBy: userId }, { acceptedBy: userId }],
      })
        .populate("createdBy", "name")
        .populate("acceptedBy", "name")
        .populate("winner", "name")
        .populate("loser", "name")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Calculate loss amount
    const loseAmount =
      battleTransactions.length > 0
        ? battleTransactions.reduce((total, transaction) => {
            return transaction?.battleId?.winner &&
              transaction?.battleId?.winner?.toString() !== userId?.toString()
              ? total + transaction.amount
              : total;
          }, 0)
        : 0;

    const wonAmount =
      battleWonTransactions.length > 0
        ? battleWonTransactions.reduce(
            (total, transaction) => total + transaction.amount,
            0
          )
        : 0;

    // Update battle win status
    battles?.forEach((battle) => {
      battle.winStatus = battle?.winner?._id
        ? battle.winner?._id.toString() === userId
          ? "WIN"
          : "LOSE"
        : "CANCELLED";
      battle.isBattleCreatedByUser =
        battle?.createdBy?._id.toString() === userId?.toString();
    });

    const referralCount = referralDepositTransactions?.length || 0;

    const totalReferralAmountCredited = referralDepositTransactions?.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    // Attach loss amount to user balance
    const userDetails = {
      ...user,
      balance: {
        ...user?.balance,
        loseAmount,
        wonAmount,
        totalReferralAmountCredited,
      },
      holdBalance:
        withdrawHistory.length > 0
          ? withdrawHistory.reduce(
              (total, transaction) =>
                transaction?.status === "pending"
                  ? total + (transaction?.amount || 0)
                  : total,
              0
            )
          : 0,

      totalReferralCount: referralCount,
      missmatchWalletBallance: 0,
      totalWithdrawAmount:
        withdrawHistory.length > 0
          ? withdrawHistory.reduce(
              (total, transaction) =>
                transaction?.status === "approved"
                  ? total + (transaction?.amount || 0)
                  : total,
              0
            )
          : 0,
      totalDepositAmount:
        depositHistory.length > 0
          ? depositHistory.reduce(
              (total, transaction) =>
                total +
                (transaction?.status === "approved" ? transaction?.amount : 0),
              0
            )
          : 0,
    };

    // Return success response
    return successHandler({
      res,
      statusCode: 200,
      message: getMessage("M068"),
      data: {
        user: userDetails,
        depositHistory,
        withdrawHistory,
        referralHistory,
        battles,
      },
    });
  } catch (err) {
    // Handle errors
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};
