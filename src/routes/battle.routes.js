const express = require("express");
const { verifyToken } = require("../utils/authHelper");
const {
  createBattle,
  deleteBattle,
  battlesListForAllUser,
  sendCreaterAcceptRequest,
  acceptOrRejectRequestByCreater,
  enterRoomNumber,
  updateBattleResultByUser,
  updateBattleResultByAdmin,
  battleHistory,
  battleDetails,
  startGameByAcceptedUser,
  battleAdminDetails,
  battleListAdmin,
} = require("../controllers/battle.controller");
const Validator = require("../validators/battle.validator");
const router = express.Router();

/**
 * @swagger
 * /api/v1/battle/create:
 *   post:
 *     summary: Create a new battle
 *     description: This endpoint creates a new battle with the specified `amount`. A valid token is required for authorization.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: string
 *                 description: The amount associated with the battle.
 *                 example: "500"
 *           example:
 *             amount: "500"
 *     responses:
 *       '201':
 *         description: Battle created successfully.
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
 *                     amount:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *               example:
 *                 statusCode: 201
 *                 status: "success"
 *                 data:
 *                   id: "64f1c2e2ab3c2d1b7f9a8e1a"
 *                   amount: "500"
 *                   createdAt: "2024-12-20T12:00:00Z"
 *       '400':
 *         description: Bad request, invalid input for payload.
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
 *                 msg: "Invalid input for amount."
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
  .route("/create")
  .post(Validator("validCreateBattle"), verifyToken, createBattle);

/**
 * @swagger
 * /api/v1/battle/{battleId}:
 *   delete:
 *     summary: Delete a battle
 *     description: Deletes a battle by its ID. A valid token is required for authorization.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     parameters:
 *       - in: path
 *         name: battleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the battle to delete.
 *         example: "64f1c2e2ab3c2d1b7f9a8e1a"
 *     responses:
 *       '200':
 *         description: Battle deleted successfully.
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
 *                 msg: "Battle deleted successfully."
 *       '400':
 *         description: Bad request, invalid input.
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
 *                 msg: "Invalid battle ID."
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
 *         description: Battle not found.
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
 *                 msg: "Battle not found."
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

router.route("/:battleId").delete(verifyToken, deleteBattle);

/**
 * @swagger
 * /api/v1/battle:
 *   get:
 *     summary: Fetch list of battles
 *     description: Retrieves a list of open and live battles. A valid token is required for authorization.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     responses:
 *       '200':
 *         description: List of battles fetched successfully.
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
 *                     openBattles:
 *                       type: array
 *                       description: List of open battles.
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The ID of the battle.
 *                           createdBy:
 *                             type: string
 *                             description: The ID of the user who created the battle.
 *                           roomNo:
 *                             type: string
 *                             nullable: true
 *                             description: The room number for the battle (if any).
 *                           status:
 *                             type: string
 *                             enum: [OPEN, PLAYING, COMPLETED]
 *                             description: The status of the battle.
 *                           entryFee:
 *                             type: number
 *                             description: The entry fee for the battle.
 *                           winnerAmount:
 *                             type: number
 *                             description: The winning amount for the battle.
 *                           acceptedBy:
 *                             type: string
 *                             nullable: true
 *                             description: The ID of the user who accepted the battle (if any).
 *                     liveBattles:
 *                       type: array
 *                       description: List of live battles where status is PLAYING.
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The ID of the battle.
 *                           createdBy:
 *                             type: string
 *                             description: The ID of the user who created the battle.
 *                           roomNo:
 *                             type: string
 *                             nullable: true
 *                             description: The room number for the battle (if any).
 *                           status:
 *                             type: string
 *                             enum: [OPEN, PLAYING, COMPLETED]
 *                             description: The status of the battle.
 *                           entryFee:
 *                             type: number
 *                             description: The entry fee for the battle.
 *                           winnerAmount:
 *                             type: number
 *                             description: The winning amount for the battle.
 *                           acceptedBy:
 *                             type: string
 *                             nullable: true
 *                             description: The ID of the user who accepted the battle (if any).
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 data:
 *                   openBattles:
 *                     - _id: "6765300b1894e79a4f527034"
 *                       createdBy: "675ea0acc649a318aae995be"
 *                       roomNo: null
 *                       status: "OPEN"
 *                       entryFee: 200
 *                       winnerAmount: 360
 *                       acceptedBy: null
 *                     - _id: "67651ce30bf17dbd78985739"
 *                       createdBy: "675ea0acc649a318aae995be"
 *                       roomNo: null
 *                       status: "OPEN"
 *                       entryFee: 200
 *                       winnerAmount: 360
 *                       acceptedBy: null
 *                   liveBattles:
 *                     - _id: "6765300b1894e79a4f527035"
 *                       createdBy: "675ea0acc649a318aae995be"
 *                       roomNo: "Room123"
 *                       status: "PLAYING"
 *                       entryFee: 500
 *                       winnerAmount: 900
 *                       acceptedBy: "67644db37cfb21e3efaa4572"
 *                     - _id: "67651ce30bf17dbd78985740"
 *                       createdBy: "675ea0acc649a318aae995be"
 *                       roomNo: "Room124"
 *                       status: "PLAYING"
 *                       entryFee: 300
 *                       winnerAmount: 540
 *                       acceptedBy: "67644db37cfb21e3efaa4573"
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

router.route("/").get(verifyToken, battlesListForAllUser);

/**
 * @swagger
 * /api/v1/battle/accept-or-reject-request-by-creater:
 *   post:
 *     summary: Accept or Reject Battle Request by Creator
 *     description: Allows the creator of a battle to accept or reject a battle request.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               battleId:
 *                 type: string
 *                 description: The ID of the battle to accept or reject.
 *                 example: "6765300b1894e79a4f527034"
 *               status:
 *                 type: string
 *                 enum: [accept, reject]
 *                 description: The status to update the battle request to.
 *                 example: "accept"
 *             required:
 *               - battleId
 *               - status
 *     responses:
 *       '200':
 *         description: Battle request accepted or rejected successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 message: "Battle request has been accepted."
 *       '400':
 *         description: Bad request, invalid input parameters.
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
 *                 msg: "Invalid battleId or status."
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
  .route("/accept-or-reject-request-by-creater")
  .post(
    Validator("validAcceptOrRejectRequestByCreater"),
    verifyToken,
    acceptOrRejectRequestByCreater
  );

/**
 * @swagger
 * /api/v1/battle/enter-room-number:
 *   post:
 *     summary: Enter Room Number for Battle
 *     description: Allows a user to enter a room number for a battle.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               battleId:
 *                 type: string
 *                 description: The ID of the battle for which the room number is being entered.
 *                 example: "6765300b1894e79a4f527034"
 *               roomNumber:
 *                 type: string
 *                 description: The room number where the battle will take place.
 *                 example: "1234A"
 *             required:
 *               - battleId
 *               - roomNumber
 *     responses:
 *       '200':
 *         description: Room number entered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 message: "Room number has been entered successfully for the battle."
 *       '400':
 *         description: Bad request, invalid input parameters.
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
 *                 msg: "Invalid battleId or roomNumber."
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
  .route("/enter-room-number")
  .post(Validator("validEnterRoomNumber"), verifyToken, enterRoomNumber);

/**
 * @swagger
 * /api/v1/battle/update-battle-result-by-user:
 *   post:
 *     summary: Update Battle Result by User
 *     description: Allows a user to update the result of a battle, such as winning, losing, or cancellation.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               battleId:
 *                 type: string
 *                 description: The ID of the battle for which the result is being updated.
 *                 example: "6765300b1894e79a4f527034"
 *               matchStatus:
 *                 type: string
 *                 description: The status of the match (WON, LOSS, or CANCELLED).
 *                 example: "WON"
 *                 enum: ["WON", "LOSS", "CANCELLED"]
 *               cancellationReason:
 *                 type: string
 *                 description: Cancellation reason if the match is cancelled.
 *                 example: "others"
 *               screenShot:
 *                 type: string
 *                 description: A URL or base64 encoded string of the screenshot if applicable.
 *                 example: "data:image/png;base64, ..."
 *             required:
 *               - battleId
 *               - matchStatus
 *     responses:
 *       '200':
 *         description: Battle result updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 message: "Battle result updated successfully."
 *       '400':
 *         description: Bad request, invalid input parameters.
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
 *                 msg: "Invalid battleId, matchStatus, or screenShot format."
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
  .route("/update-battle-result-by-user")
  .post(
    // Validator("ValidUpdateBattleResultByUser"),
    verifyToken,
    updateBattleResultByUser
  );

/**
 * @swagger
 * /api/v1/battle/game-history:
 *   get:
 *     summary: Get Battle History
 *     description: Retrieves the battle history of the user, including details of past battles.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     responses:
 *       '200':
 *         description: Battle history retrieved successfully.
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
 *                       battleId:
 *                         type: string
 *                         description: The ID of the battle.
 *                         example: "6765300b1894e79a4f527034"
 *                       matchStatus:
 *                         type: string
 *                         description: The result of the battle (e.g., WON, LOSS, CANCELLED).
 *                         example: "WON"
 *                       entryFee:
 *                         type: number
 *                         description: The entry fee for the battle.
 *                         example: 200
 *                       winnerAmount:
 *                         type: number
 *                         description: The amount the winner will receive.
 *                         example: 360
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the battle was created.
 *                         example: "2024-06-10T14:12:00Z"
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 data:
 *                   - battleId: "6765300b1894e79a4f527034"
 *                     matchStatus: "WON"
 *                     entryFee: 200
 *                     winnerAmount: 360
 *                     createdAt: "2024-06-10T14:12:00Z"
 *                   - battleId: "67652fa4dddf250a410ab121"
 *                     matchStatus: "LOSS"
 *                     entryFee: 200
 *                     winnerAmount: 360
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

router.route("/game-history").get(verifyToken, battleHistory);

/**
 * @swagger
 * /api/v1/battle/update-battle-result-by-admin:
 *   post:
 *     summary: Update Battle Result by Admin
 *     description: Admin can update the result of a battle, specifying the winner and loser of the battle.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               battleId:
 *                 type: string
 *                 description: The ID of the battle to update.
 *                 example: "6765300b1894e79a4f527034"
 *               winner:
 *                 type: string
 *                 description: The ID of the user who won the battle.
 *                 example: "675ea0acc649a318aae995be"
 *               loser:
 *                 type: string
 *                 description: The ID of the user who lost the battle.
 *                 example: "67644db37cfb21e3efaa4571"
 *     responses:
 *       '200':
 *         description: Battle result updated successfully.
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
 *                 msg: "Battle result updated successfully."
 *       '400':
 *         description: Bad request, invalid input for the battle result.
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
 *                 msg: "Invalid input for battle result."
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
  .route("/update-battle-result-by-admin")
  .post(
    Validator("ValidUpdateBattleResultByAdmin"),
    verifyToken,
    updateBattleResultByAdmin
  );

/**
 * @swagger
 * /api/v1/battle/send-creater-accept-request/{battleId}:
 *   get:
 *     summary: Send Creator Accept Request
 *     description: Sends an accept request for a battle created by the user. The `battleId` is passed in the route parameter.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     parameters:
 *       - in: path
 *         name: battleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the battle for which the accept request is being sent.
 *         example: "6765300b1894e79a4f527034"
 *     responses:
 *       '200':
 *         description: Accept request successfully sent to the battle creator.
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
 *                 msg: "Accept request sent successfully."
 *       '400':
 *         description: Bad request, invalid battle ID or other request error.
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
 *                 msg: "Invalid battle ID or request parameters."
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
 *         description: Battle not found for the provided ID.
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
 *                 msg: "Battle not found."
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
  .route("/send-creater-accept-request/:battleId")
  .get(verifyToken, sendCreaterAcceptRequest);

/**
 * @swagger
 * /api/v1/battle/details/{battleId}:
 *   get:
 *     summary: Get Battle Details
 *     description: Fetches the details of a specific battle based on the `battleId` provided in the route parameter.
 *     tags: [Battle]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     parameters:
 *       - in: path
 *         name: battleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the battle whose details are being fetched.
 *         example: "6765300b1894e79a4f527034"
 *     responses:
 *       '200':
 *         description: Successfully fetched the battle details.
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
 *                     _id:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     roomNo:
 *                       type: string
 *                       nullable: true
 *                     status:
 *                       type: string
 *                     entryFee:
 *                       type: number
 *                     winnerAmount:
 *                       type: number
 *                     acceptedBy:
 *                       type: string
 *                       nullable: true
 *                 example:
 *                   statusCode: 200
 *                   status: "success"
 *                   data:
 *                     _id: "6765300b1894e79a4f527034"
 *                     createdBy: "675ea0acc649a318aae995be"
 *                     roomNo: null
 *                     status: "OPEN"
 *                     entryFee: 200
 *                     winnerAmount: 360
 *                     acceptedBy: null
 *       '400':
 *         description: Bad request, invalid battle ID or other request error.
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
 *                 msg: "Invalid battle ID or request parameters."
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
 *         description: Battle not found for the provided ID.
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
 *                 msg: "Battle not found."
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

router.route("/details/:battleId").get(verifyToken, battleDetails);

/**
 * @swagger
 * /api/v1/battle/admin/details/{battleId}:
 *   get:
 *     summary: Get Battle Details
 *     description: Fetches the details of a specific battle based on the `battleId` provided in the route parameter.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: [] # Token-based authorization
 *     parameters:
 *       - in: path
 *         name: battleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the battle whose details are being fetched.
 *         example: "6765300b1894e79a4f527034"
 *     responses:
 *       '200':
 *         description: Successfully fetched the battle details.
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
 *                     _id:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     roomNo:
 *                       type: string
 *                       nullable: true
 *                     status:
 *                       type: string
 *                     entryFee:
 *                       type: number
 *                     winnerAmount:
 *                       type: number
 *                     acceptedBy:
 *                       type: string
 *                       nullable: true
 *                 example:
 *                   statusCode: 200
 *                   status: "success"
 *                   data:
 *                     _id: "6765300b1894e79a4f527034"
 *                     createdBy: "675ea0acc649a318aae995be"
 *                     roomNo: null
 *                     status: "OPEN"
 *                     entryFee: 200
 *                     winnerAmount: 360
 *                     acceptedBy: null
 *       '400':
 *         description: Bad request, invalid battle ID or other request error.
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
 *                 msg: "Invalid battle ID or request parameters."
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
 *         description: Battle not found for the provided ID.
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
 *                 msg: "Battle not found."
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

router.route("/admin/details/:battleId").get(verifyToken, battleAdminDetails);

/**
 * @swagger
 * /api/v1/battle/admin/list:
 *   get:
 *     summary: Get battle list
 *     description: Retrieves a list of all battles for admin view.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Battle list fetched successfully.
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
 *                         description: Unique identifier for the battle.
 *                       romNo:
 *                         type: string
 *                         description: Room number of the battle.
 *                       description:
 *                         type: string
 *                         description: Description of the battle.
 *                       status:
 *                         type: string
 *                         description: Status of the battle (e.g., 'OPEN', 'PLAYING', 'COMPLETED').
 *               example:
 *                 statusCode: 200
 *                 status: "success"
 *                 data:
 *                   - _id: "btl123"
 *                     roomNo: "123456"
 *                     status: "OPEN"
 *                   - _id: "btl124"
 *                     roomNo: "Championship Clash"
 *                     status: "COMPLETED"
 *       '401':
 *         description: Unauthorized, invalid, or missing token.
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
 *                 msg: "Unauthorized, invalid, or missing token."
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

router.route("/admin/list").get(verifyToken, battleListAdmin);

router
  .route("/start-battle-by-accepted-user/:battleId")
  .get(verifyToken, startGameByAcceptedUser);

module.exports = router;
