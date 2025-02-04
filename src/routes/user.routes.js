const express = require("express");
const router = express.Router();
const {
  generateOTP,
  verifyOTP,
  login,
  createAdminUser,
  logout,
  profile,
  uploadKYCDocument,
  userDashboard,
  updateProfile,
  getReferralAmountPercentage,
  getSocialMediaLinks,
  getAdminUPIDetails,
  getReferralHistory,
  getReferAndEarnPageData,
  resendOTP,
} = require("../controllers/user.controller.js");
const { verifyToken } = require("../utils/authHelper.js");
const Validators = require("../validators/user.validator.js");
/**
 * @swagger
 * /api/v1/users/generate-otp:
 *   post:
 *     summary: Send OTP to the provided mobile number.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNo:
 *                 type: string
 *                 pattern: "^\\d{10}$"
 *                 description: Mobile number must be exactly 10 digits.
 *             required:
 *               - mobileNo
 *     responses:
 *       '200':
 *         description: OTP sent successfully.
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     otp:
 *                       type: string
 *                       description: The OTP sent to the user.
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 msg: "OTP sent successfully!"
 *                 data:
 *                   otp: "123456"
 *       '400':
 *         description: Invalid mobile number.
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
 *                 msg: "Invalid mobile number. Mobile number must be 10 digits."
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

router.route("/generate-otp").post(Validators("validSendOTP"), generateOTP);

/**
 * @swagger
 * /api/v1/users/verify-otp:
 *   post:
 *     summary: Verify OTP for the provided mobile number.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobileNo:
 *                 type: string
 *                 pattern: "^\\d{10}$"
 *                 description: Mobile number must be exactly 10 digits.
 *               otp:
 *                 type: string
 *                 pattern: "^\\d{6}$"
 *                 description: OTP must be exactly 6 digits.
 *               referalCode:
 *                 type: string
 *                 description: Referral code for the user.
 *             required:
 *               - mobileNo
 *               - otp
 *     responses:
 *       '200':
 *         description: OTP verified successfully.
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
 *                 msg: "OTP verified successfully."
 *       '400':
 *         description: Invalid OTP or mobile number.
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
 *                 msg: "Invalid OTP or mobile number."
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

router.route("/verify-otp").post(Validators("validVerifyOTP"), verifyOTP);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Authenticate a user with email and password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful.
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
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 msg: "Login successful."
 *                 token: "your_jwt_token_here"
 *       '400':
 *         description: Invalid email or password.
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
 *                 msg: "Invalid email or password."
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

router.route("/admin/login").post(Validators("validLogin"), login);

/**
 * @swagger
 * /api/v1/users/admin/register:
 *   post:
 *     summary: Register an Admin user
 *     description: Registers an admin user with name, email, password, and mobile number.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the admin.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin's email address.
 *               password:
 *                 type: string
 *                 description: Admin's password.
 *               mobileNo:
 *                 type: string
 *                 description: Admin's mobile number, must be exactly 10 digits.
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Admin user successfully registered.
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
 *                 msg: "Admin user successfully registered."
 *       '400':
 *         description: Bad request, validation failed (e.g., invalid mobile number or missing fields).
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
 *                 msg: "Validation failed: Mobile number should be of 10 digits."
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
  .route("/admin/register")
  .post(Validators("validAdminRegister"), verifyToken, createAdminUser);

/**
 * @swagger
 * /api/v1/users/logout:
 *   get:
 *     summary: Logout a user
 *     description: Logs the user out by invalidating their session or JWT token.
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: Successfully logged out.
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
 *                 msg: "Successfully logged out."
 *       '401':
 *         description: Unauthorized, no active session or invalid token.
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
 *                 msg: "Unauthorized, no active session."
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

router.route("/logout", verifyToken).get(logout);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Update user profile
 *     description: Updates the profile information of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the user.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the user.
 *                 example: "johndoe@example.com"
 *               mobileNo:
 *                 type: string
 *                 pattern: "^[0-9]{10}$"
 *                 description: The updated mobile number of the user (10 digits).
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 description: The updated password of the user.
 *                 example: "NewSecurePassword123!"
 *     responses:
 *       '200':
 *         description: User profile successfully updated.
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the user.
 *                       example: "1234567890abcdef"
 *                     name:
 *                       type: string
 *                       description: The updated name of the user.
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       description: The updated email of the user.
 *                       example: "johndoe@example.com"
 *                     mobileNo:
 *                       type: string
 *                       description: The updated mobile number of the user.
 *                       example: "9876543210"
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
 *         description: Unauthorized, missing or invalid token.
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
  .route("/")
  .post(Validators("validUpdateProfile"), verifyToken, updateProfile);

/**
 * @swagger
 * /api/v1/users/upload-kyc-document:
 *   post:
 *     summary: Upload KYC document
 *     description: Allows a user to upload their KYC (Know Your Customer) document, including name, ID, and photos.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kycDocument:
 *                 type: object
 *                 required:
 *                   - name
 *                   - frontPhoto
 *                   - backPhoto
 *                   - id
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the individual on the KYC document.
 *                     example: "John Doe"
 *                   frontPhoto:
 *                     type: string
 *                     description: URL or Base64 string of the front side of the document.
 *                     example: "data:image/png;base64,..."
 *                   backPhoto:
 *                     type: string
 *                     description: URL or Base64 string of the back side of the document.
 *                     example: "data:image/png;base64,..."
 *                   aadharNumber:
 *                     type: string
 *                     description: Unique identifier of the document.
 *                     example: "AB1234567"
 *     responses:
 *       '200':
 *         description: KYC document uploaded successfully.
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
 *                 msg: "KYC document uploaded successfully."
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
 *                 msg: "Unauthorized. Token is missing or invalid."
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
  .route("/upload-kyc-document")
  .post(Validators("validUploadKYCDocument"), verifyToken, uploadKYCDocument);

/**
 * @swagger
 * /api/v1/users/user-dashboard:
 *   get:
 *     summary: Retrieve user dashboard data
 *     description: Fetches personalized dashboard data for the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved dashboard data.
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
 *                   description: The user-specific dashboard data.
 *                   example:
 *                     recentActivities:
 *                       - activity: "Logged in"
 *                         timestamp: "2024-12-15T10:00:00Z"
 *                       - activity: "Updated profile"
 *                         timestamp: "2024-12-14T15:30:00Z"
 *                     notifications:
 *                       - message: "Your profile was updated successfully."
 *                         read: false
 *                     stats:
 *                       totalTransactions: 15
 *                       totalEarnings: 5000
 *       '401':
 *         description: Unauthorized, missing or invalid token.
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

router.route("/user-dashboard").get(verifyToken, userDashboard);

/**
 * @swagger
 * /api/v1/users/get-social-media-links:
 *   get:
 *     summary: Retrieve social media links
 *     description: Fetches the configured social media links for the user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved social media links.
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
 *                   properties:
 *                     whatsAppLink:
 *                       type: string
 *                       description: WhatsApp link.
 *                       example: "https://wa.me/1234567890"
 *                     facebookLink:
 *                       type: string
 *                       description: Facebook page link.
 *                       example: "https://facebook.com/yourpage"
 *                     instagramLink:
 *                       type: string
 *                       description: Instagram profile link.
 *                       example: "https://instagram.com/yourprofile"
 *                     telegramLink:
 *                       type: string
 *                       description: Telegram link.
 *                       example: "https://t.me/yourchannel"
 *       '401':
 *         description: Unauthorized, missing or invalid token.
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

router.route("/get-social-media-links").get(verifyToken, getSocialMediaLinks);

/**
 * @swagger
 * /api/v1/users/get-referral-amount-percentage:
 *   get:
 *     summary: Retrieve referral amount percentage
 *     description: Fetches the referral amount percentage configured for the user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved referral amount percentage.
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
 *                   properties:
 *                     referralAmountPercentage:
 *                       type: number
 *                       description: The referral amount percentage.
 *                       example: 5
 *       '401':
 *         description: Unauthorized, missing or invalid token.
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
  .route("/get-referral-amount-percentage")
  .get(verifyToken, getReferralAmountPercentage);

/**
 * @swagger
 * /api/v1/admin/get-admin-upi:
 *   get:
 *     summary: Get admin UPI details
 *     description: Retrieves the admin's UPI details, including UPI QR code and UPI ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Admin UPI details retrieved successfully.
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
 *                   properties:
 *                     upiQrCode:
 *                       type: string
 *                       description: Base64 encoded UPI QR code image.
 *                     upiId:
 *                       type: string
 *                       description: Admin's UPI ID.
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 data:
 *                   upiQrCode: "data:image/png;base64,example_qr_code_base64"
 *                   upiId: "example@upi"
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
 *         description: UPI details not found.
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
 *                 msg: "UPI details not found."
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

router.route("/get-admin-upi").get(verifyToken, getAdminUPIDetails);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information of the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved user profile.
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
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the user.
 *                       example: "1234567890abcdef"
 *                     name:
 *                       type: string
 *                       description: The name of the user.
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                       example: "johndoe@example.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date the user profile was created.
 *                       example: "2024-01-01T12:00:00Z"
 *       '401':
 *         description: Unauthorized, missing or invalid token.
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

router.route("/referral-history").get(verifyToken, getReferralHistory);

router.route("/referr-and-earn-page").get(verifyToken, getReferAndEarnPageData);

router.route("/").get(verifyToken, profile);

router.route("/resend-otp").post(Validators("validSendOTP"), resendOTP);

module.exports = router;
