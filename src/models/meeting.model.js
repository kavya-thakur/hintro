const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema(
  {
    timestamp: {
      type: String,
      required: true,
    },
    speaker: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
    },

    participants: {
      type: [participantSchema],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one participant is required",
      },
    },

    meetingDate: {
      type: Date,
      required: [true, "Meeting date is required"],
    },

    transcript: {
      type: [transcriptSchema],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "Transcript cannot be empty",
      },
    },

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

const meetingModel = mongoose.model("meeting", meetingSchema);

module.exports = meetingModel;
