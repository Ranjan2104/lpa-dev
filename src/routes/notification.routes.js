const express = require("express");
const Validator = require("../validators/notification.validator");
const { verifyToken } = require("../utils/authHelper");
const {
  sendNotificationByAdmin,
  deleteNotification,
  getNotifications,
} = require("../controllers/notification.controller");
const router = express.Router();

/**
 * @swagger
 * /api/v1/notification:
 *   post:
 *     summary: Send Notification by Admin
 *     description: Allows an admin to send a notification with a title, message, and target user ID.
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the notification.
 *                 example: "System Update"
 *               message:
 *                 type: string
 *                 description: The content of the notification message.
 *                 example: "The system will undergo maintenance at midnight."
 *               userId:
 *                 type: string
 *                 description: The unique user ID to whom the notification is sent.
 *                 example: "64f1c2e2ab3c2d1b7f9a8e1a"
 *     responses:
 *       '200':
 *         description: Notification sent successfully.
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
 *                 msg: "Notification sent successfully!"
 *       '400':
 *         description: Bad request, validation errors occurred.
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
 *                 msg: "Validation failed. Missing required fields."
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
  .route("/")
  .post(
    Validator("validSendNotification"),
    verifyToken,
    sendNotificationByAdmin
  );

/**
 * @swagger
 * /api/v1/notification/{notificationId}:
 *   delete:
 *     summary: Delete a specific notification
 *     description: Allows an admin or authorized user to delete a specific notification by its ID.
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the notification to delete.
 *         example: "64f1c2e2ab3c2d1b7f9a8e1c"
 *     responses:
 *       '200':
 *         description: Notification successfully deleted.
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
 *                 msg: "Notification deleted successfully!"
 *       '400':
 *         description: Bad request, invalid notification ID format.
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
 *                 msg: "Invalid notification ID format."
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
 *       '404':
 *         description: Notification not found.
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
 *                 msg: "Notification not found."
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

router.route("/:notificationId").delete(verifyToken, deleteNotification);

/**
 * @swagger
 * /api/v1/notification:
 *   get:
 *     summary: Get notifications
 *     description: Fetches notifications. Use query parameters to fetch all notifications or notifications for a specific user.
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     parameters:
 *       - in: query
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           enum: [all, userId]
 *         description: Use "all" to fetch all notifications, or provide a specific user ID to fetch notifications for that user.
 *         example: "all"
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: The user ID for which notifications should be fetched. Required only if `data` is set to `userId`.
 *         example: "64f1c2e2ab3c2d1b7f9a8e1a"
 *     responses:
 *       '200':
 *         description: Notifications fetched successfully!
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
 *                       title:
 *                         type: string
 *                       message:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 data:
 *                   - _id: "64f1c2e2ab3c2d1b7f9a8e1a"
 *                     title: "System Update"
 *                     message: "The system will undergo maintenance."
 *                     createdAt: "2024-06-10T14:12:00Z"
 *                   - _id: "64f1c2e2ab3c2d1b7f9a8e1b"
 *                     title: "Reminder"
 *                     message: "Your subscription expires tomorrow."
 *                     createdAt: "2024-06-09T10:00:00Z"
 *       '400':
 *         description: Bad request, invalid input for query parameters.
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
 *                 msg: "Invalid query parameter or user ID."
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

router.route("/").get(verifyToken, getNotifications);

module.exports = router;
