const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendReminderEmail({ to, task, assignee, dueDate }) {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",

    to,

    subject: "Overdue Action Item Reminder",

    html: `
        <h2>Action Item Reminder</h2>

        <p>This action item is overdue.</p>

        <p>
          <strong>Task:</strong>
          ${task}
        </p>

        <p>
          <strong>Assigned To:</strong>
          ${assignee}
        </p>

        <p>
          <strong>Due Date:</strong>
          ${new Date(dueDate).toLocaleDateString()}
        </p>
      `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

module.exports = {
  sendReminderEmail,
};
