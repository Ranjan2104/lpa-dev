const express = require("express");
const { verifyToken } = require("../utils/authHelper");
const {
  updateSocialMediaLinks,
  approveKYC,
  updatePaymentSetting,
  getSettingsConfig,
  updateReferralAmountPercentage,
  getAllUsersList,
  getUnverifiedUsersList,
  adminDashboard,
  blockOrUnblockUsers,
  getUsersList,
  uploadKYCDocument,
  addBonus,
  penalty,
  updateBattleEarningPercentage,
  getUserDetails,
  rejectKYC,
} = require("../controllers/settingsController");
const Validator = require("../validators/settings.validators");
const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/update-social-media-links:
 *   post:
 *     summary: Update social media links
 *     description: Allows an admin to update the social media links, such as WhatsApp, Facebook, Instagram, and Telegram.
 *     tags: [Admin/settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               whatsAppLink:
 *                 type: string
 *                 description: The WhatsApp link.
 *                 example: "https://wa.me/123456789"
 *               facebookLink:
 *                 type: string
 *                 description: The Facebook profile or page link.
 *                 example: "https://www.facebook.com/example"
 *               instagramLink:
 *                 type: string
 *                 description: The Instagram profile link.
 *                 example: "https://www.instagram.com/example"
 *               telegramLink:
 *                 type: string
 *                 description: The Telegram profile or group link.
 *                 example: "https://t.me/example"
 *     responses:
 *       '200':
 *         description: Social media links successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 msg: "Social media links updated successfully."
 *       '400':
 *         description: Bad request, invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msg: "Invalid input data."
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 401
 *                 status: "error"
 *                 msg: "Unauthorized, invalid or missing token."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msg: "Internal server error."
 */

router
  .route("/update-social-media-links")
  .post(
    Validator("validSocialMediaLinks"),
    verifyToken,
    updateSocialMediaLinks
  );

/**
 * @swagger
 * /api/v1/admin/upadate-referral-amount-percentage:
 *   post:
 *     summary: Update referral amount percentage
 *     description: Allows an admin to update the referral amount percentage.
 *     tags: [Admin/settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referralAmountPercentage:
 *                 type: number
 *                 description: The new referral amount percentage to be set.
 *                 example: 15
 *     responses:
 *       '200':
 *         description: Referral amount percentage successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 msg: "Referral amount percentage updated successfully."
 *       '400':
 *         description: Bad request, invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msg: "Invalid input data."
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 401
 *                 status: "error"
 *                 msg: "Unauthorized, invalid or missing token."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msg: "Internal server error."
 */

router
  .route("/upadate-referral-amount-percentage")
  .post(
    Validator("validUpdateReferralAmountPercentage"),
    verifyToken,
    updateReferralAmountPercentage
  );

/**
 * @swagger
 * /api/v1/admin/update-payment-setting:
 *   post:
 *     summary: Update payment settings
 *     description: Allows an admin to update the payment settings, such as UPI QR code and UPI ID.
 *     tags: [Admin/settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               upiQrCode:
 *                 type: string
 *                 description: The UPI QR code as a string.
 *                 example: "data:image/png;base64,example_qr_code_base64"
 *               upiId:
 *                 type: string
 *                 description: The UPI ID.
 *                 example: "example@upi"
 *     responses:
 *       '200':
 *         description: Payment settings successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 msg: "Payment settings updated successfully."
 *       '400':
 *         description: Bad request, invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msg: "Invalid input data."
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 401
 *                 status: "error"
 *                 msg: "Unauthorized, invalid or missing token."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msg: "Internal server error."
 */

router
  .route("/update-payment-setting")
  .post(
    Validator("validUpdatePaymentSettings"),
    verifyToken,
    updatePaymentSetting
  );

/**
 * @swagger
 * /api/v1/admin/approve-kyc/{userId}:
 *   post:
 *     summary: Approve KYC for a user
 *     description: Allows an admin to approve the KYC (Know Your Customer) process for a specific user.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user whose KYC is being approved.
 *     responses:
 *       '200':
 *         description: KYC approved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 msg: "KYC approved successfully."
 *       '400':
 *         description: Bad request, invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msg: "Invalid input data."
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 401
 *                 status: "error"
 *                 msg: "Unauthorized, invalid or missing token."
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 404
 *                 status: "error"
 *                 msg: "User not found."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msg: "Internal server error."
 */

router.route("/approve-kyc/:userId").post(verifyToken, approveKYC);

router.route("/reject-kyc/:userId").post(verifyToken, rejectKYC);

/**
 * @swagger
 * /api/v1/admin/settings:
 *   get:
 *     summary: Get settings configuration
 *     description: Retrieves the current configuration settings for the admin panel.
 *     tags: [Admin/settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Settings configuration retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: The configuration settings data.
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 data:
 *                   paymentSettings:
 *                     upiQrCode: "data:image/png;base64,example_qr_code_base64"
 *                     upiId: "example@upi"
 *                   socialMediaLinks:
 *                     whatsAppLink: "https://wa.me/123456789"
 *                     facebookLink: "https://www.facebook.com/example"
 *                     instagramLink: "https://www.instagram.com/example"
 *                     telegramLink: "https://t.me/example"
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 401
 *                 status: "error"
 *                 msg: "Unauthorized, invalid or missing token."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msg: "Internal server error."
 */

router.route("/settings").get(verifyToken, getSettingsConfig);

/**
 * @swagger
 * /api/v1/admin/all-users:
 *   get:
 *     summary: Get all users list
 *     description: Retrieves a list of all registered users.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Users list retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 data:
 *                   - id: "123"
 *                     name: "John"
 *                     mobileNo: "Doe"
 *       '401':
 *         description: Unauthorized, invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 401
 *                 status: "error"
 *                 msg: "Unauthorized, invalid or missing token."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msg: "Internal server error."
 */

router.route("/all-users").get(verifyToken, getUsersList);

router
  .route("/get-verification-request-list")
  .get(verifyToken, getUnverifiedUsersList);

router.route("/dashboard").get(verifyToken, adminDashboard);

router
  .route("/block-user")
  .post(verifyToken, Validator("validBlockUser"), blockOrUnblockUsers);

router.route("/all-users-list").get(verifyToken, getAllUsersList);

router
  .route("/upload-kyc-document")
  .post(Validator("validUploadKYCDocument"), verifyToken, uploadKYCDocument);

router
  .route("/add-bonus")
  .post(Validator("validAddBonus"), verifyToken, addBonus);

router
  .route("/add-penalty")
  .post(Validator("validAddBonus"), verifyToken, penalty);

router
  .route("/add-battle-earning-percentage")
  .post(
    Validator("validupdateBattleEarningPercentage"),
    verifyToken,
    updateBattleEarningPercentage
  );

router.route("/user-details/:userId").get(verifyToken, getUserDetails);

module.exports = router;
