// server.js
// === 1) Конфиги и принудительный IPv4 (опционально) ===
require("dotenv").config();
const dns = require("dns");
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder("ipv4first");

// === 2) Express и CORS ===
const express = require("express");
const cors = require("cors");
const path = require("path");

// === 3) Подключение Sequelize и моделей ===
const db = require("./models/index"); // models/index.js из предыдущего шага
// в нём уже импортируются Sequelize, DataTypes и подхватывается DATABASE_URL

// === 4) Роуты ===
// а) аутентификация
const { router: authRouter, authCheck } = require("./routes/auth.routes");
// б) анализаторы
const cyclomaticRouter = require("./routes/cyclomatic.routes");
const nestingRouter = require("./routes/nesting.routes");
const depthRouter = require("./routes/depth.routes");
const cognitiveRouter = require("./routes/cognitive.routes");
const inheritanceRouter = require("./routes/inheritance.routes");
const maintainabilityRouter = require("./routes/maintainability.routes");
const commentsRouter = require("./routes/comments.routes");
const readabilityRouter = require("./routes/readability.routes");
const historyRouter = require("./routes/history.routes");
const reportRouter = require("./routes/report.routes");

const app = express();

// === 5) Настройка CORS ===
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:8080";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.options("*", cors());

// === 6) Парсер JSON ===
app.use(express.json());

// === 7) Маршруты ===
// Аутентификация
app.use("/api/auth", authRouter);
app.get("/api/protected", authCheck, (req, res) => {
  res.json({ message: `Вы вошли как ${req.user.login}` });
});

// Анализ кода
app.use("/api/report/cyclomatic", cyclomaticRouter);
app.use("/api/report/nesting", nestingRouter);
app.use("/api/report/depth", depthRouter);
app.use("/api/report/cognitive", cognitiveRouter);
app.use("/api/report/inheritance", inheritanceRouter);
app.use("/api/report/maintainability", maintainabilityRouter);
app.use("/api/report/comments", commentsRouter);
app.use("/api/report/readability", readabilityRouter);

// История
app.use("/api/history", historyRouter);

// Универсальный PDF-отчёт
app.use("/api/report/full", reportRouter);

// Статика для скачивания PDF
app.use(
  "/static/reports",
  express.static(path.join(__dirname, "static/reports"))
);

// === 8) Sync + запуск ===
const PORT = parseInt(process.env.PORT, 10) || 5000;
db.sequelize
  .sync()
  .then(() => {
    console.log("✅ DB connected and synced");
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB sync failed:", err);
    process.exit(1);
  });
