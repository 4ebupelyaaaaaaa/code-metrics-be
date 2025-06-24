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
app.options("*", cors());

// JSON parser
app.use(express.json());

// Роуты
const { router: authRouter, authCheck } = require("./routes/auth.routes");
app.use("/api/auth", authRouter);
app.get("/api/protected", authCheck, (req, res) => {
  res.json({ message: `Вы вошли как ${req.user.login}` });
});

app.use("/api/report/cyclomatic", require("./routes/cyclomatic.routes"));
app.use("/api/report/nesting", require("./routes/nesting.routes"));
app.use("/api/report/depth", require("./routes/depth.routes"));
app.use("/api/report/cognitive", require("./routes/cognitive.routes"));
app.use("/api/report/inheritance", require("./routes/inheritance.routes"));
app.use(
  "/api/report/maintainability",
  require("./routes/maintainability.routes")
);
app.use("/api/report/comments", require("./routes/comments.routes"));
app.use("/api/report/readability", require("./routes/readability.routes"));
app.use("/api/history", require("./routes/history.routes"));
app.use("/api/report/full", require("./routes/report.routes"));

// Статика PDF
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
