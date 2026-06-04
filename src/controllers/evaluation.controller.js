const sendResponse = require("../utils/sendResponse");

function getEvaluation(req, res) {
  return sendResponse(req, res, 200, {
    candidate: {
      name: "Kavya",
      email: "kavya@gmail.com",
    },

    project: {
      name: "Hintro Meeting Intelligence API",
      version: "1.0.0",
    },

    architecture: {
      database: "MongoDB",
      authentication: "JWT Cookie Authentication",
      aiModel: "Gemini 2.5 Flash",
      scheduler: "node-cron",
      emailProvider: "Resend",
    },

    features: [
      "Authentication",
      "Meeting Management",
      "Meeting Analysis",
      "Grounded Citations",
      "Action Item Tracking",
      "Overdue Action Item Detection",
      "Email Reminder System",
      "Reminder Scheduler",
      "Swagger Documentation",
      "Trace IDs",
      "Centralized Error Handling",
      "Structured Logging",
    ],
  });
}

module.exports = {
  getEvaluation,
};
