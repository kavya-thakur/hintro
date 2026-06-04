const mongoose = require("mongoose");

const actionItemSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
    },

    assignee: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      default: "PENDING",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "meeting",
      required: true,
    },

    citations: [
      {
        timestamp: {
          type: String,
          required: true,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const actionItemModel = mongoose.model("actionItem", actionItemSchema);
module.exports = actionItemModel;
