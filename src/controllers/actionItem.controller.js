const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const actionItemModel = require("../models/actionItem.model");
const meetingModel = require("../models/meeting.model");

const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const getActionItems = asyncHandler(async (req, res) => {
  const { status, assignee, meetingId } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const filter = {
    createdBy: req.user.id,
  };

  if (status) {
    filter.status = status;
  }

  if (assignee) {
    filter.assignee = assignee;
  }

  if (meetingId) {
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      throw new AppError("Invalid meeting id", 400, "VALIDATION_ERROR");
    }

    filter.meetingId = meetingId;
  }

  const [actionItems, total] = await Promise.all([
    actionItemModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    actionItemModel.countDocuments(filter),
  ]);

  return sendResponse(req, res, 200, {
    actionItems,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const createActionItem = asyncHandler(async (req, res) => {
  const { task, assignee, meetingId, dueDate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    throw new AppError("Invalid meeting id", 400, "VALIDATION_ERROR");
  }

  const meeting = await meetingModel.findOne({
    _id: meetingId,
    createdBy: req.user.id,
  });

  if (!meeting) {
    throw new AppError("Meeting not found", 404, "MEETING_NOT_FOUND");
  }

  const actionItem = await actionItemModel.create({
    task,
    assignee,
    meetingId,
    dueDate,
    createdBy: req.user.id,
    citations: [],
  });

  return sendResponse(req, res, 201, {
    actionItem,
  });
});

const updateActionItemStatus = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid action item id", 400, "VALIDATION_ERROR");
  }

  const { status } = req.body;

  const actionItem = await actionItemModel.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user.id,
    },
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!actionItem) {
    throw new AppError("Action item not found", 404, "ACTION_ITEM_NOT_FOUND");
  }

  return sendResponse(req, res, 200, {
    actionItem,
  });
});

const getOverdueActionItems = asyncHandler(async (req, res) => {
  const actionItems = await actionItemModel
    .find({
      createdBy: req.user.id,

      status: {
        $ne: "COMPLETED",
      },

      dueDate: {
        $lt: new Date(),
      },
    })
    .sort({
      dueDate: 1,
    });

  return sendResponse(req, res, 200, {
    actionItems,
  });
});

module.exports = {
  getActionItems,
  createActionItem,
  updateActionItemStatus,
  getOverdueActionItems,
};
