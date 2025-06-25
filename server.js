// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models/index");

const app = express();

// CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// JSON parser
app.use(express.json());

// Роуты
// Аутентификация
const { router: authRouter, authCheck } = require("./routes/auth.routes");

// Наши новые роуты
const cyclomaticRouter = require("./routes/cyclomatic.routes");
const nestingRouter = require("./routes/nesting.routes");
const depthRouter = require("./routes/depth.routes");
const cognitiveRouter = require("./routes/cognitive.routes");
const inheritanceRouter = require("./routes/inheritance.routes.js");
const maintainabilityRouter = require("./routes/maintainability.routes.js");
const commentsRouter = require("./routes/comments.routes.js");
const readabilityRouter = require("./routes/readability.routes.js");
const historyRouter = require("./routes/history.routes.js");
const reportRouter = require("./routes/report.routes.js");

// Для парсинга JSON в теле запроса
app.use(express.json());

// --- Маршруты аутентификации ---
app.use("/api/auth", authRouter);
app.get("/api/protected", authCheck, (req, res) => {
  res.json({ message: `Вы вошли как ${req.user.login}` });
});

// --- Маршруты для отчётов ---
// POST /api/report/cyclomatic  — анализ цикломатической сложности
// POST /api/report/nesting     — анализ глубины вложенности
app.use("/api/report", cyclomaticRouter);
app.use("/api/report", nestingRouter);
app.use("/api/report", depthRouter);
app.use("/api/report", cognitiveRouter);
app.use("/api/report", inheritanceRouter);
app.use("/api/report", maintainabilityRouter);
app.use("/api/report", commentsRouter);
app.use("/api/report", readabilityRouter);
app.use("/api/report", readabilityRouter);
app.use("/api/history", historyRouter);
app.use("/api/report", reportRouter);

// Статика для скачивания PDF
app.use(
  "/static/reports",
  express.static(path.join(__dirname, "static/reports"))
);

// Синк и запуск
const PORT = +process.env.PORT || 5000;
db.sequelize
  .sync()
  .then(() => {
    console.log("✅ DB connected");
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch((e) => {
    console.error("❌ DB sync error:", e);
    process.exit(1);
  });
