const { z } = require("zod");

const createActionItemSchema = z.object({
  task: z.string().trim().min(1, "Task is required"),

  assignee: z.string().trim().optional(),

  meetingId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid meeting id"),

  dueDate: z.iso.datetime(),
});

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

module.exports = {
  createActionItemSchema,
  updateStatusSchema,
};
