const express = require("express");
const { verifyToken } = require("../utils/authHelper");
const { applyReferralCode } = require("../controllers/referral.controller");
const router = express.Router();

router
  .route("/apply")
  .post(Validator("validReferralApply"), verifyToken, applyReferralCode);

module.exports = router;
