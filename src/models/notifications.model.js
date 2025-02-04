const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Notification = model("notification", notificationSchema);

module.exports = Notification;
