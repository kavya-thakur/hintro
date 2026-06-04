const mongoose = require("mongoose");

const reminderHistorySchema = new mongoose.Schema(
  {
    actionItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "actionItem",
      required: true,
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },

    channel: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
    },

    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("reminderHistory", reminderHistorySchema);
