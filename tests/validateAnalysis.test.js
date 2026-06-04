const validateAnalysis = require("../src/utils/validateAnalysis");

describe("validateAnalysis", () => {
  const transcript = [
    {
      timestamp: "00:10",
      speaker: "John",
      text: "Launch next Friday",
    },
    {
      timestamp: "00:20",
      speaker: "Alice",
      text: "I will prepare release notes",
    },
  ];

  it("should validate a correct AI response", () => {
    const analysis = {
      summary: [
        {
          text: "Team plans to launch next Friday",
          citations: [{ timestamp: "00:10" }],
        },
      ],
      decisions: [],
      followUps: [],
      actionItems: [
        {
          task: "Prepare release notes",
          assignee: "Alice",
          citations: [{ timestamp: "00:20" }],
        },
      ],
    };

    expect(validateAnalysis(analysis, transcript)).toBe(true);
  });

  it("should throw when citation timestamp does not exist", () => {
    const analysis = {
      summary: [
        {
          text: "Launch next Friday",
          citations: [{ timestamp: "99:99" }],
        },
      ],
      decisions: [],
      followUps: [],
      actionItems: [],
    };

    expect(() => {
      validateAnalysis(analysis, transcript);
    }).toThrow("Invalid citation timestamp");
  });

  it("should throw when citations are missing", () => {
    const analysis = {
      summary: [
        {
          text: "Launch next Friday",
          citations: [],
        },
      ],
      decisions: [],
      followUps: [],
      actionItems: [],
    };

    expect(() => {
      validateAnalysis(analysis, transcript);
    }).toThrow("Missing citations");
  });

  it("should throw when required sections are missing", () => {
    const analysis = {
      summary: [],
    };

    expect(() => {
      validateAnalysis(analysis, transcript);
    }).toThrow("Missing decisions in AI response");
  });
});
