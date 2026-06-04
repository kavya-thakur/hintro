const { z } = require("zod");

const registerSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

module.exports = {
  registerSchema,
};
