const mongoose = require("mongoose");

const citationSchema = new mongoose.Schema(
  {
    timestamp: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const insightSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    citations: {
      type: [citationSchema],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const actionItemSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },

    assignee: {
      type: String,
      default: null,
    },

    citations: {
      type: [citationSchema],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const meetingAnalysisSchema = new mongoose.Schema(
  {
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "meeting",

      required: true,

      unique: true,
    },

    summary: {
      type: [insightSchema],
      default: [],
    },

    decisions: {
      type: [insightSchema],
      default: [],
    },

    followUps: {
      type: [insightSchema],
      default: [],
    },

    actionItems: {
      type: [actionItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const meetingAnalysisModel = mongoose.model(
  "meetingAnalysis",
  meetingAnalysisSchema,
);
module.exports = meetingAnalysisModel;
