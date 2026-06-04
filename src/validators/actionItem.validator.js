const { z } = require("zod");

const createActionItemSchema = z.object({
  task: z.string().min(1),

  assignee: z.string().optional(),

  meetingId: z.string(),

  dueDate: z.string(),
});

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

module.exports = {
  createActionItemSchema,
  updateStatusSchema,
};
