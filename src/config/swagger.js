const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Hintro Meeting Intelligence API",
      version: "1.0.0",
      description:
        "AI-powered meeting intelligence platform for extracting summaries, decisions, follow-ups and action items from meeting transcripts.",
    },

    servers: [
      {
        url: "https://hintro-0foh.onrender.com",
        description: "Production Server",
      },
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],

    security: [
      {
        cookieAuth: [],
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "68401a58a23a92e75d11b111",
            },

            email: {
              type: "string",
              example: "alice@example.com",
            },
          },
        },

        Participant: {
          type: "object",

          required: ["name", "email"],

          properties: {
            name: {
              type: "string",
              example: "Alice",
            },

            email: {
              type: "string",
              example: "alice@example.com",
            },
          },
        },

        TranscriptEntry: {
          type: "object",

          required: ["timestamp", "speaker", "text"],

          properties: {
            timestamp: {
              type: "string",
              example: "00:10",
            },

            speaker: {
              type: "string",
              example: "John",
            },

            text: {
              type: "string",
              example: "We should launch next Friday.",
            },
          },
        },

        Citation: {
          type: "object",

          properties: {
            timestamp: {
              type: "string",
              example: "00:10",
            },
          },
        },

        Insight: {
          type: "object",

          properties: {
            text: {
              type: "string",
              example: "The team agreed to launch next Friday.",
            },

            citations: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Citation",
              },
            },
          },
        },

        Meeting: {
          type: "object",

          required: ["title", "participants", "meetingDate", "transcript"],

          properties: {
            title: {
              type: "string",
              example: "Sprint Planning",
            },

            participants: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Participant",
              },
            },

            meetingDate: {
              type: "string",
              format: "date-time",
              example: "2026-06-04T10:00:00.000Z",
            },

            transcript: {
              type: "array",

              items: {
                $ref: "#/components/schemas/TranscriptEntry",
              },
            },
          },
        },

        ActionItem: {
          type: "object",

          properties: {
            task: {
              type: "string",
              example: "Prepare release notes",
            },

            assignee: {
              type: "string",
              example: "Alice",
            },

            status: {
              type: "string",

              enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],

              example: "PENDING",
            },

            dueDate: {
              type: "string",

              format: "date-time",

              example: "2026-06-10T00:00:00.000Z",
            },

            meetingId: {
              type: "string",
              example: "68401a58a23a92e75d11b111",
            },

            citations: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Citation",
              },
            },
          },
        },

        MeetingAnalysis: {
          type: "object",

          properties: {
            summary: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Insight",
              },
            },

            decisions: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Insight",
              },
            },

            followUps: {
              type: "array",

              items: {
                $ref: "#/components/schemas/Insight",
              },
            },

            actionItems: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  task: {
                    type: "string",
                  },

                  assignee: {
                    type: "string",
                  },

                  citations: {
                    type: "array",

                    items: {
                      $ref: "#/components/schemas/Citation",
                    },
                  },
                },
              },
            },
          },
        },

        ReminderHistory: {
          type: "object",

          properties: {
            channel: {
              type: "string",
              example: "EMAIL",
            },

            status: {
              type: "string",

              enum: ["SUCCESS", "FAILED"],

              example: "SUCCESS",
            },

            errorMessage: {
              type: "string",
              nullable: true,
            },
          },
        },

        SuccessResponse: {
          type: "object",

          properties: {
            traceId: {
              type: "string",
              example: "d14de5c2-1007-4621-a0de-016a82e5ac3d",
            },

            success: {
              type: "boolean",
              example: true,
            },

            data: {
              type: "object",
            },
          },
        },

        ErrorResponse: {
          type: "object",

          properties: {
            traceId: {
              type: "string",
              example: "d14de5c2-1007-4621-a0de-016a82e5ac3d",
            },

            success: {
              type: "boolean",
              example: false,
            },

            error: {
              type: "object",

              properties: {
                code: {
                  type: "string",
                  example: "VALIDATION_ERROR",
                },

                message: {
                  type: "string",
                  example: "Invalid meeting id",
                },
              },
            },
          },
        },
      },
    },

    tags: [
      {
        name: "Authentication",
      },
      {
        name: "Meetings",
      },
      {
        name: "Action Items",
      },
      {
        name: "Health",
      },
      {
        name: "Evaluation",
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
