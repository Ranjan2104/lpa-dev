const { Schema, model } = require("mongoose");

const battleCommissionSchema = new Schema(
  {
    commissionPercentage: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    battleId: {
      type: Schema.Types.ObjectId,
      ref: "Battle",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BattleCommission = model("BattleCommission", battleCommissionSchema);

module.exports = BattleCommission;
