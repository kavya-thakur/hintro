const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createActionItemSchema,
  updateStatusSchema,
} = require("../validators/actionItem.validator");

const {
  getActionItems,
  updateActionItemStatus,
  getOverdueActionItems,
  createActionItem,
} = require("../controllers/actionItem.controller");

const router = express.Router();

/**
 * @swagger
 * /api/action-items/overdue:
 *   get:
 *     summary: Get overdue action items
 *     description: Returns all overdue action items that are not completed for the authenticated user.
 *     tags:
 *       - Action Items
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Overdue action items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/overdue", authMiddleware, getOverdueActionItems);

/**
 * @swagger
 * /api/action-items:
 *   get:
 *     summary: Get action items
 *     description: Retrieve action items with pagination and optional filters.
 *     tags:
 *       - Action Items
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - IN_PROGRESS
 *             - COMPLETED
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: string
 *           example: Alice
 *       - in: query
 *         name: meetingId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Action items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authMiddleware, getActionItems);

/**
 * @swagger
 * /api/action-items/{id}/status:
 *   patch:
 *     summary: Update action item status
 *     description: Update the status of an existing action item.
 *     tags:
 *       - Action Items
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - IN_PROGRESS
 *                   - COMPLETED
 *     responses:
 *       200:
 *         description: Action item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Action item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:id/status",
  authMiddleware,
  validate(updateStatusSchema),
  updateActionItemStatus,
);

/**
 * @swagger
 * /api/action-items:
 *   post:
 *     summary: Create a new action item
 *     description: Create an action item linked to an existing meeting.
 *     tags:
 *       - Action Items
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - task
 *               - meetingId
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *                 example: Prepare release notes
 *               assignee:
 *                 type: string
 *                 example: Alice
 *               meetingId:
 *                 type: string
 *                 example: 68401a58a23a92e75d11b111
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-06-10T00:00:00.000Z
 *     responses:
 *       201:
 *         description: Action item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Meeting not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  authMiddleware,
  validate(createActionItemSchema),
  createActionItem,
);

module.exports = router;
