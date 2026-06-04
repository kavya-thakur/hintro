const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const { createMeetingSchema } = require("../validators/meeting.validator");
const validate = require("../middlewares/validate.middleware");

const {
  createMeeting,
  getMeeting,
  getMeetings,
  deleteMeeting,
  analyzeMeeting,
} = require("../controllers/meeting.controller");

/**
 * @swagger
 * /api/meeting:
 *   post:
 *     summary: Create a meeting
 *     description: Create a new meeting with participants and transcript data.
 *     tags:
 *       - Meetings
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       201:
 *         description: Meeting created successfully
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
router.post("/", authMiddleware, validate(createMeetingSchema), createMeeting);
/**
 * @swagger
 * /api/meeting:
 *   get:
 *     summary: Get meetings
 *     description: Retrieve paginated meetings belonging to the authenticated user.
 *     tags:
 *       - Meetings
 *     security:
 *       - cookieAuth: []
 *     parameters:
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
 *         description: Meetings fetched successfully
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
router.get("/", authMiddleware, getMeetings);
/**
 * @swagger
 * /api/meeting/{id}:
 *   get:
 *     summary: Get a single meeting
 *     description: Retrieve a specific meeting owned by the authenticated user.
 *     tags:
 *       - Meetings
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meeting fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Meeting not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", authMiddleware, getMeeting);
/**
 * @swagger
 * /api/meeting/{id}:
 *   delete:
 *     summary: Delete a meeting
 *     description: Permanently delete a meeting owned by the authenticated user.
 *     tags:
 *       - Meetings
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meeting deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Meeting not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", authMiddleware, deleteMeeting);
/**
 * @swagger
 * /api/meeting/{id}/analyze:
 *   post:
 *     summary: Analyze meeting transcript using AI
 *     description: Extracts summaries, decisions, follow-ups and action items with timestamp citations from the meeting transcript.
 *     tags:
 *       - Meetings
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meeting analyzed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Meeting not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: AI analysis failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:id/analyze", authMiddleware, analyzeMeeting);

module.exports = router;
