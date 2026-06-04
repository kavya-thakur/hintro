const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

module.exports = {
  registerSchema,
};
