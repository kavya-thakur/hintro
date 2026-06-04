require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/db/db");

async function startServer() {
  try {
    await connectDb();

    require("./src/jobs/reminder.job");

    app.listen(3000, () => {
      console.log("Backend is running on port 3000");
    });
  } catch (error) {
    console.error("Failed to start server", error);

    process.exit(1);
  }
}

startServer();
