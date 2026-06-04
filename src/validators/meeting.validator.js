const { z } = require("zod");

const transcriptSchema = z.object({
  timestamp: z.string().trim().min(1, "Timestamp is required"),

  speaker: z.string().trim().min(1, "Speaker is required"),

  text: z.string().trim().min(1, "Transcript text is required"),
});

const participantSchema = z.object({
  name: z.string().trim().min(1, "Participant name is required"),

  email: z.string().trim().email("Invalid participant email"),
});

const createMeetingSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  participants: z
    .array(participantSchema)
    .min(1, "At least one participant is required")
    .max(10, "Maximum 10 participants allowed"),

  meetingDate: z.iso.datetime(),

  transcript: z.array(transcriptSchema).min(1, "Transcript cannot be empty"),
});

module.exports = {
  createMeetingSchema,
};
