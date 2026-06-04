const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const healthRoute = require("./routes/health.route");
const meetingRoutes = require("./routes/meeting.route");
const actionItemRoutes = require("./routes/actionItem.route");
const evaluationRoutes = require("./routes/evaluation.route");
const traceMiddleware = require("./middlewares/trace.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const loggerMiddleware = require("./middlewares/logger.middleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(traceMiddleware);
app.use(loggerMiddleware);

app.use("/health", healthRoute);
app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api/action-items", actionItemRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/evaluation", evaluationRoutes);
app.use(errorMiddleware);

module.exports = app;
