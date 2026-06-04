require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/db/db");

async function startServer() {
  try {
    await connectDb();

    require("./src/jobs/reminder.job");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Backend is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);

    process.exit(1);
  }
}

startServer();
