const { Schema, model } = require("mongoose");
const User = require("./user.model"); // Import the User model

const bankAccountDetailsSchema = new Schema({
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
});

const userDetailsSchema = new Schema({
  name: { type: String, required: true },
  mobileNo: { type: String, required: true },
});

const transactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userDetails: userDetailsSchema,
    type: {
      type: String,
      enum: ["deposit", "withdraw", "referral", "bonus", "penalty"],
      required: true,
    },
    isReferral: { type: Boolean, default: false },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["upi", "bankAccount"] },
    isBattleTransaction: { type: Boolean, default: false },
    isWonCash: { type: Boolean, default: false },
    upiId: { type: String },
    battleId: { type: Schema.Types.ObjectId, ref: "battle", default: null },
    bankAccountDetails: bankAccountDetailsSchema,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    utrNo: { type: String },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    depositWalletBalance: { type: Number, default: 0 },
    cashWonWalletBalance: { type: Number, default: 0 },
    screenShot: { type: String, default: null },
    adminUPIId: { type: String, default: null },
    closingBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

transactionSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) return next();

    const user = await User.findById(this.userId).lean();
    if (!user || !user.balance) {
      return next(new Error("User not found or balance field missing"));
    }

    this.depositWalletBalance = user?.balance?.totalBalance || 0;
    this.cashWonWalletBalance = user?.balance?.cashWon || 0;

    next();
  } catch (error) {
    next(error);
  }
});

transactionSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    try {
      const transaction = await this.model.findOne(this.getQuery()); 
      if (!transaction) return next();

      await User.findByIdAndUpdate(transaction.userId, {
        $inc: {
          "balance.totalBalance": transaction.depositWalletBalance,
          "balance.cashWon": transaction.cashWonWalletBalance,
          "balance.totalWalletBalance":
            transaction.depositWalletBalance + transaction.cashWonWalletBalance,
        },
      });

      next();
    } catch (error) {
      next(error);
    }
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
