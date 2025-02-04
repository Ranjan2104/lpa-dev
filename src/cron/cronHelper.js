const Battle = require("../models/battle.model");
const {
  updateWinningAmountForWinner,
  updateWalletAndDeleteTransaction,
} = require("../utils/battleHelper");
const dayjs = require("dayjs");
exports.updateBattleResult = async () => {
  try {
    const battles = await Battle.find({ status: "PLAYING" });
    if (battles.length > 0) {
      for (let index = 0; index < battles.length; index++) {
        const battle = battles[index];
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
              battle?.resultUpatedBy?.acceptedUser?.matchStatus ===
                "CANCELLED" &&
              battle?.resultUpatedBy?.createdUser?.matchStatus === "CANCELLED"
            ) {
              battle.winner = null;
              battle.loser = null;
              battle.matchStatus = "CANCELLED";
              battle.status = "CLOSED";
            }
            battle.paymentStatus = "COMPLETED";
            await updateWinningAmountForWinner(battle);
            await battle.save();
          }
        }
      }
    }
  } catch (err) {
    console.log("error", err);
  }
};

exports.updateBttleResultNotUpdatedByUser = async () => {
  try {
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 45);

    const battles = await Battle.find({
      status: { $in: ["OPEN", "PLAYING"] },
      createdAt: { $lte: thirtyMinutesAgo },
    });

    if (battles.length === 0) {
      return;
    }

    for (const battle of battles) {
      let isModified = false;

      if (!battle.resultUpatedBy) {
        battle.resultUpatedBy = {};
        isModified = true;
      }

      if (
        !battle.resultUpatedBy.acceptedUser ||
        !battle.resultUpatedBy.acceptedUser.matchStatus
      ) {
        battle.resultUpatedBy.acceptedUser = {
          matchStatus: "CANCELLED",
          screenShot: null,
          cancellationReason: null,
          updatedAt: new Date(),
        };
        isModified = true;
      }

      if (
        !battle.resultUpatedBy.createdUser ||
        !battle.resultUpatedBy.createdUser.matchStatus
      ) {
        battle.resultUpatedBy.createdUser = {
          matchStatus: "CANCELLED",
          screenShot: null,
          cancellationReason: null,
          updatedAt: new Date(),
        };
        isModified = true;
      }

      if (battle.status !== "CLOSED" || battle.status !== "CONFLICT") {
        battle.status = "CONFLICT";
        isModified = true;
      }

      if (isModified) {
        battle.markModified("resultUpatedBy");
        battle.markModified("status");
        await battle.save();
      }
    }
  } catch (err) {
    console.error("Error updating battles:", err);
  }
};
exports.updateBattleIFNoAcceptor = async () => {
  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const battlesToDelete = await Battle.find({
      status: { $in: ["OPEN", "PLAYING"] },
      createdAt: { $lte: fiveMinutesAgo },
      acceptedBy: null,
    });

    if (battlesToDelete?.length > 0) {
      const battleIds = battlesToDelete.map((battle) => battle._id);

      await Battle.deleteMany({ _id: { $in: battleIds } });

      for (const battle of battlesToDelete) {
        await updateWalletAndDeleteTransaction(
          battle?.createdBy,
          battle?.entryFee,
          battle?._id
        );

        await updateWalletAndDeleteTransaction(
          battle?.acceptedBy,
          battle?.entryFee,
          battle?._id
        );
      }
    }

    if (battlesToDelete.length > 0) {
      console.log("deleted", battlesToDelete?.length);
    }
  } catch (err) {
    console.log("error", err);
  }
};
