function cleanAiResponse(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

module.exports = cleanAiResponse;
