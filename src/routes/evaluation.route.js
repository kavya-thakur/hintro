const express = require("express");

const { getEvaluation } = require("../controllers/evaluation.controller");

const router = express.Router();

/**
 * @swagger
 * /api/evaluation:
 *   get:
 *     summary: Project evaluation endpoint
 *     description: Returns project metadata, architecture decisions and implemented features.
 *     tags:
 *       - Evaluation
 *     responses:
 *       200:
 *         description: Evaluation information fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get("/", getEvaluation);

module.exports = router;
