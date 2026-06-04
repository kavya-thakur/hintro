const sendResponse = require("../utils/sendResponse");

function getEvaluation(req, res) {
  return sendResponse(req, res, 200, {
    candidateName: "Kavya",

    email: "kavya@gmail.com",

    repositoryUrl: "https://github.com/kavya-thakur/hintro",

    deployedUrl: "https://hintro-0foh.onrender.com",

    externalIntegration: "Resend Email API",

    features: [
      "Authentication",
      "Meeting Management",
      "AI Meeting Analysis",
      "Grounded Citations",
      "Action Item Tracking",
      "Overdue Action Item Detection",
      "Scheduled Reminder Job",
      "Email Reminder Integration",
      "Swagger Documentation",
      "Request Traceability",
      "Structured Logging",
      "Global Error Handling",
      "Input Validation",
    ],
  });
}

module.exports = {
  getEvaluation,
};
