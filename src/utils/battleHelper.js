const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const Settings = require("../models/settings.model");
const { errorHandler } = require("./responseHandler");
const BattleCommission = require("../models/battleCommission.model");

//function to update withdraw transaction and total balance in schemas
const updateTransactionForStartingGame = async (userId, entryFee, battleId) => {
  try {
    const userDetails = await User.findOne({ _id: userId }, { balance: 1 });
    if (userDetails?.balance?.totalWalletBalance < entryFee) {
      throw new Error("Insufficient balance");
    }

    userDetails.balance.totalWalletBalance -= entryFee;

    await Transaction.create({
      userId: userId,
      type: "withdraw",
      amount: entryFee,
      status: "approved",
      isBattleTransaction: true,
      battleId: battleId,
      closingBalance: userDetails?.balance?.totalWalletBalance,
    });

    if (userDetails?.balance?.totalBalance < entryFee) {
      const withdrawAmount = entryFee - userDetails?.balance?.totalBalance;
      userDetails.balance.totalBalance = 0;
      userDetails.balance.cashWon -= withdrawAmount;
    } else {
      userDetails.balance.totalBalance -= entryFee;
    }
    userDetails.balance.battlePlayed += 1;
    userDetails.save();
  } catch (error) {
    console.error("Error updating transaction or user:", error);
    throw error;
  }
};

const isValidAmount = (amount) => {
  return amount > 0 && amount % 50 === 0;
};

const updateWinningAmountForWinner = async (data) => {
  try {
    if (
      data.resultUpatedBy?.acceptedUser?.matchStatus === "CANCELLED" &&
      data.resultUpatedBy?.createdUser?.matchStatus === "CANCELLED"
    ) {
      // const createdUser = await User.findOne({ _id: data?.createdBy });
      // const acceptedUser = await User.findOne({ _id: data?.acceptedBy });

      const createdUserTransaction = await Transaction.deleteOne({
        battleId: data?._id,
        userId: data?.createdBy,
      });

      if (createdUserTransaction.deletedCount > 0) {
        // createdUser.balance.totalBalance += data.entryFee;
        // createdUser.balance.totalWalletBalance += data.entryFee;
      }

      const acceptedUserTransaction = await Transaction.deleteOne({
        battleId: data?._id,
        userId: data?.acceptedBy,
      });

      if (acceptedUserTransaction.deletedCount > 0) {
        // acceptedUser.balance.totalBalance += data.entryFee;
        // acceptedUser.balance.totalWalletBalance += data.entryFee;
      }

      // await createdUser?.save();
      // await acceptedUser?.save();
    } else {
      if (!data.winner) return;
      const userDetails = await User.findOne({ _id: data.winner });

      userDetails.balance.totalWalletBalance += data.winnerAmount;

      await Transaction.create({
        userId: data.winner,
        type: "deposit",
        amount: data.winnerAmount,
        status: "approved",
        isBattleTransaction: true,
        battleId: data._id,
        isWonCash: true,
        closingBalance: userDetails?.balance?.totalWalletBalance,
      });

      userDetails.balance.cashWon += data.winnerAmount;

      await userDetails.save();
      const referredUserDetails = await User.findOne({
        _id: userDetails?.referedBy,
      });

      const settings = await Settings.findOne(
        {},
        { battleEarningPercentage: 1, referralAmountPercentage: 1 }
      );

      const battleEarningPercentage = settings?.battleEarningPercentage || 20; // Default to 20 if not found
      const commisionAmount = Math.round(
        data?.entryFee * (battleEarningPercentage / 100)
      );

      await BattleCommission.create({
        amount: commisionAmount,
        commissionPercentage: battleEarningPercentage,
        battleId: data._id,
      });

      if (referredUserDetails) {
        const referralEarningPercentage =
          settings?.referralAmountPercentage || 0;
        const referralAmount = Math.round(
          (data?.entryFee * referralEarningPercentage) / 100
        );
        // Add 2% of the winning amount to the referrer's referralEarning
        referredUserDetails.balance.referralEarning += referralAmount;

        // Check if the user exists in the referredUsers array
        const referredUser = referredUserDetails.referredUsers.find(
          (user) => user.userId.toString() === data.winner.toString()
        );

        await Transaction.create({
          userId: referredUserDetails._id,
          type: "deposit",
          amount: referralAmount,
          status: "approved",
          isBattleTransaction: true,
          battleId: data._id,
          isReferral: true,
          closingBalance: referredUserDetails?.balance?.totalWalletBalance,
        });

        if (referredUser) {
          // Update referralEarning for the user in the referredUsers array
          referredUser.referralEarning += referralAmount;

          // Save the updated referredUserDetails
          await referredUserDetails.save();
        }
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateWinningAmountByUsers = async (battle) => {
  try {
    if (!battle.winner || !battle.loser) {
      if (
        battle?.resultUpatedBy?.acceptedUser?.matchStatus &&
        battle?.resultUpatedBy?.createdUser?.matchStatus
      ) {
        if (
          battle?.resultUpatedBy?.acceptedUser?.matchStatus === "WON" &&
          battle?.resultUpatedBy?.createdUser?.matchStatus === "LOSS"
        ) {
          battle.winner = battle?.acceptedBy;
          battle.loser = battle?.createdBy;
          battle.matchStatus = "COMPLETED";
          battle.status = "CLOSED";
        } else if (
          battle?.resultUpatedBy?.acceptedUser?.matchStatus === "LOSS" &&
          battle?.resultUpatedBy?.createdUser?.matchStatus === "WON"
        ) {
          battle.loser = battle?.acceptedBy;
          battle.winner = battle?.createdBy;
          battle.matchStatus = "COMPLETED";
          battle.status = "CLOSED";
        } else if (
          battle?.resultUpatedBy?.acceptedUser?.matchStatus === "CANCELLED" &&
          battle?.resultUpatedBy?.createdUser?.matchStatus === "CANCELLED"
        ) {
          battle.winner = null;
          battle.loser = null;
          battle.matchStatus = "CANCELLED";
          battle.status = "CLOSED";
        } else {
          battle.winner = null;
          battle.loser = null;
          battle.status = "CONFLICT";
        }
        battle.paymentStatus = "COMPLETED";
        await updateWinningAmountForWinner(battle);
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateWalletAndDeleteTransaction = async (userId, entryFee, battleId) => {
  const user = await User.findOne({ _id: userId });
  const transaction = await Transaction.deleteOne({
    battleId: battleId,
    userId: userId,
  });

  // if (transaction.deletedCount > 0) {
  //   user.balance.totalBalance += entryFee;
  //   user.balance.totalWalletBalance += entryFee;
  //   await user.save();
  // }
};

module.exports = {
  updateTransactionForStartingGame,
  updateWinningAmountForWinner,
  isValidAmount,
  updateWinningAmountByUsers,
  updateWalletAndDeleteTransaction,
};
