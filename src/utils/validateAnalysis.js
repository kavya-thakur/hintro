const AppError = require("./AppError");

function validateAnalysis(analysis, transcript) {
  const requiredFields = ["summary", "decisions", "followUps", "actionItems"];

  for (const field of requiredFields) {
    if (!Array.isArray(analysis[field])) {
      throw new AppError(
        `Missing ${field} in AI response`,
        500,
        "AI_RESPONSE_ERROR",
      );
    }
  }

  const validTimestamps = new Set(transcript.map((item) => item.timestamp));

  const validateCitations = (citations) => {
    if (!Array.isArray(citations) || citations.length === 0) {
      throw new AppError("Missing citations", 500, "INVALID_CITATIONS");
    }

    for (const citation of citations) {
      if (!validTimestamps.has(citation.timestamp)) {
        throw new AppError(
          "Invalid citation timestamp",
          500,
          "INVALID_CITATION",
        );
      }
    }
  };

  const validateInsight = (items) => {
    for (const item of items) {
      if (!item.text) {
        throw new AppError(
          "Invalid AI response structure",
          500,
          "AI_RESPONSE_ERROR",
        );
      }

      validateCitations(item.citations);
    }
  };

  validateInsight(analysis.summary);

  validateInsight(analysis.decisions);

  validateInsight(analysis.followUps);

  for (const item of analysis.actionItems) {
    if (!item.task) {
      throw new AppError("Action item task missing", 500, "AI_RESPONSE_ERROR");
    }

    validateCitations(item.citations);
  }

  return true;
}

module.exports = validateAnalysis;
