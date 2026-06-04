const cron = require("node-cron");

const actionItemModel = require("../models/actionItem.model");

const meetingModel = require("../models/meeting.model");

const reminderHistoryModel = require("../models/reminderHistory.model");

const { sendReminderEmail } = require("../services/email.service");

async function processReminders() {
  const overdueItems = await actionItemModel.find({
    status: {
      $ne: "COMPLETED",
    },

    dueDate: {
      $lt: new Date(),
    },
  });

  for (const item of overdueItems) {
    try {
      const alreadySent = await reminderHistoryModel.findOne({
        actionItemId: item._id,

        status: "SUCCESS",
      });

      if (alreadySent) {
        continue;
      }

      const meeting = await meetingModel.findById(item.meetingId);

      if (!meeting) {
        continue;
      }

      const participant = meeting.participants.find(
        (participant) =>
          participant.name?.toLowerCase().trim() ===
          item.assignee?.toLowerCase().trim(),
      );

      if (!participant) {
        continue;
      }

      await sendReminderEmail({
        to: participant.email,

        task: item.task,

        assignee: item.assignee,

        dueDate: item.dueDate,
      });

      await reminderHistoryModel.create({
        actionItemId: item._id,

        channel: "EMAIL",

        status: "SUCCESS",
      });
    } catch (error) {
      await reminderHistoryModel.create({
        actionItemId: item._id,

        channel: "EMAIL",

        status: "FAILED",

        errorMessage: error.message,
      });
    }
  }
}

cron.schedule("*/5 * * * *", async () => {
  console.log("Running reminder job...");

  await processReminders();
});

module.exports = {
  processReminders,
};
