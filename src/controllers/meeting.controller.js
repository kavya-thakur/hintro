const meetingModel = require("../models/meeting.model");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");
const meetingAnalysisModel = require("../models/meetingAnalysis.model");
const buildAnalysisPrompt = require("../services/prompt.service");
const ai = require("../services/ai.service");
const cleanAiResponse = require("../utils/cleanAiResponse");
const actionItemModel = require("../models/actionItem.model");
const validateAnalysis = require("../utils/validateAnalysis");

const createMeeting = asyncHandler(async (req, res) => {
  const { title, participants, meetingDate, transcript } = req.body;

  const meeting = await meetingModel.create({
    title,
    participants,
    meetingDate,
    transcript,
    createdBy: req.user.id,
  });

  return sendResponse(req, res, 201, {
    meeting,
  });
});

const getMeeting = asyncHandler(async (req, res) => {
  const meeting = await meetingModel.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!meeting) {
    throw new AppError("Meeting not found", 404, "MEETING_NOT_FOUND");
  }

  return sendResponse(req, res, 200, {
    meeting,
  });
});

const getMeetings = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const meetings = await meetingModel
    .find({
      createdBy: req.user.id,
    })
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  const totalMeetings = await meetingModel.countDocuments({
    createdBy: req.user.id,
  });

  return sendResponse(req, res, 200, {
    meetings,
    pagination: {
      total: totalMeetings,
      page,
      limit,
      totalPages: Math.ceil(totalMeetings / limit),
    },
  });
});

const deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await meetingModel.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.id,
  });

  if (!meeting) {
    throw new AppError("Meeting not found", 404, "MEETING_NOT_FOUND");
  }

  return sendResponse(req, res, 200, {
    message: "Meeting deleted successfully",
  });
});

const analyzeMeeting = asyncHandler(async (req, res) => {
  const meeting = await meetingModel.findOne({
    _id: req.params.id,

    createdBy: req.user.id,
  });

  if (!meeting) {
    throw new AppError("Meeting not found", 404, "MEETING_NOT_FOUND");
  }

  const prompt = buildAnalysisPrompt(meeting.transcript);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: prompt,
  });

  const rawText = cleanAiResponse(response.text);

  let analysis;

  try {
    analysis = JSON.parse(rawText);
  } catch {
    throw new AppError(
      "Failed to parse AI response",

      500,

      "AI_RESPONSE_ERROR",
    );
  }

  validateAnalysis(analysis, meeting.transcript);

  if (analysis.actionItems.length > 0) {
    await actionItemModel.insertMany(
      analysis.actionItems.map((item) => ({
        task: item.task,
        assignee: item.assignee,
        citations: item.citations,
        meetingId: meeting._id,
        createdBy: req.user.id,
      })),
    );
  }
  let savedAnalysis;

  const existingAnalysis = await meetingAnalysisModel.findOne({
    meetingId: meeting._id,
  });

  if (existingAnalysis) {
    savedAnalysis = await meetingAnalysisModel.findByIdAndUpdate(
      existingAnalysis._id,

      {
        ...analysis,
      },

      {
        new: true,

        runValidators: true,
      },
    );
  } else {
    savedAnalysis = await meetingAnalysisModel.create({
      meetingId: meeting._id,

      ...analysis,
    });
  }

  return sendResponse(req, res, 200, {
    analysis: savedAnalysis,
  });
});

module.exports = {
  createMeeting,
  getMeeting,
  getMeetings,
  deleteMeeting,
  analyzeMeeting,
};
