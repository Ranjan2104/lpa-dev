const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/authHelper");
const {
  createTransaction,
  getTransactions,
  transactionResponse,
} = require("../controllers/transaction.conroller");
const Validator = require("../validators/transaction.validator");

/**
 * @swagger
 * /api/v1/transaction:
 *   post:
 *     summary: Create a new transaction
 *     description: Allows the user to create a transaction, either a deposit or a withdrawal.
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of the transaction.
 *                 example: 500
 *               type:
 *                 type: string
 *                 description: The type of transaction, either "deposit" or "withdraw".
 *                 enum: ["deposit", "withdraw"]
 *                 example: "deposit"
 *               screenShot:
 *                 type: string
 *                 description: A screenshot of the transaction as proof (optional).
 *                 example: "base64-encoded-image-data"
 *     responses:
 *       '201':
 *         description: Transaction successfully created.
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
 *                     transactionId:
 *                       type: string
 *                       description: The ID of the created transaction.
 *                     amount:
 *                       type: number
 *                     type:
 *                       type: string
 *                       enum: ["deposit", "withdraw"]
 *                       description: The type of transaction, either "deposit" or "withdraw".
 *                     screenShot:
 *                       type: string
 *               example:
 *                 statusCode: 201
 *                 status: "success"
 *                 data:
 *                   transactionId: "12345abc"
 *                   amount: 500
 *                   type: "deposit"
 *                   screenShot: "base64-encoded-image-data"
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
  .route("/")
  .post(Validator("validTransactionEntry"), verifyToken, createTransaction);

/**
 * @swagger
 * /api/v1/transaction/admin-response:
 *   post:
 *     summary: Admin transaction response
 *     description: Allows an admin to respond to a transaction by verifying or rejecting it.
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: The unique ID of the transaction.
 *                 example: "64f1c2e2ab3c2d1b7f9a8e1a"
 *               isApproved:
 *                 type: boolean
 *                 description: Indicates whether the transaction is approved or rejected.
 *                 example: true
 *     responses:
 *       '200':
 *         description: Transaction response successfully updated by admin.
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
 *                 msg: "Transaction response updated successfully."
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
  .route("/admin-response")
  .post(
    Validator("validTransactionResponseByAdmin"),
    verifyToken,
    transactionResponse
  );

/**
 * @swagger
 * /api/v1/transaction:
 *   get:
 *     summary: Get all transactions
 *     description: Fetches a list of all transactions.
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     responses:
 *       '200':
 *         description: Transactions fetched successfully!
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
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the transaction.
 *                       amount:
 *                         type: number
 *                         description: The transaction amount.
 *                       type:
 *                         type: string
 *                         description: Type of transaction (e.g., "debit" or "credit").
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the transaction was created.
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 data:
 *                   - _id: "64f1c2e2ab3c2d1b7f9a8e1a"
 *                     amount: 1500
 *                     type: "credit"
 *                     createdAt: "2024-06-10T14:12:00Z"
 *                   - _id: "64f1c2e2ab3c2d1b7f9a8e1b"
 *                     amount: 500
 *                     type: "debit"
 *                     createdAt: "2024-06-09T10:00:00Z"
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

router.route("/").get(verifyToken, getTransactions);

module.exports = router;
