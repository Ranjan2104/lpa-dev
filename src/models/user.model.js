const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const kycDocumentSchema = new Schema({
  aadharNumber: {
    type: String,
    trim: true,
    default: null,
  },
  name: {
    type: String,
    trim: true,
    default: null,
  },
  frontPhoto: {
    type: String,
    trim: true,
    default: null,
  },
  backPhoto: {
    type: String,
    trim: true,
    default: null,
  },
});

const balanceSchema = new Schema({
  cashWon: {
    type: Number,
    default: 0,
  },
  totalWalletBalance: {
    type: Number,
    default: 0,
  },
  totalBalance: {
    type: Number,
    default: 0,
  },
  referralEarning: {
    type: Number,
    default: 0,
  },
  penalty: {
    type: Number,
    default: 0,
  },
  battlePlayed: {
    type: Number,
    default: 0,
  },
  bonus: {
    type: Number,
    default: 0,
  },
});

const referredUserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  referralEarning: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

referredUserSchema.pre("save", function (next) {
  if (this.isModified("referralEarning")) {
    this.updatedAt = new Date();
  }
  next();
});

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Anonymous Player",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    mobileNo: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "superAdmin"],
      default: "user",
    },
    referalCode: {
      type: String,
      trim: true,
    },
    referedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    salt: {
      type: String,
      trim: true,
      default: null,
    },
    isKYCVerified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    authToken: {
      type: String,
      default: null,
    },
    kycDocument: {
      type: kycDocumentSchema,
      default: () => ({}),
    },
    balance: {
      type: balanceSchema,
      default: () => ({}),
    },
    referredUsers: [referredUserSchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate a unique referral code for "user" role
userSchema.pre("save", async function (next) {
  if (this.role === "user" && !this.referalCode) {
    const uuidSegment = uuidv4().split("-")[0]; // Use a segment of the UUID
    this.referalCode = uuidSegment;
  }
  next();
});

const User = model("User", userSchema);

module.exports = User;
