const { Schema, model } = require("mongoose");

const otpSchema = new Schema(
  {
    mobileNo: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OTP = model("OTP", otpSchema);

module.exports = OTP;
