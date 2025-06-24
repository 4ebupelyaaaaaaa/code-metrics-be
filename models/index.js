// models/index.js
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize"); // <-- добавили DataTypes
const cfg = require("../config/db.config");

let sequelize;
if (cfg.url) {
  // Supabase даёт postgresql://… — заменим на postgres://
  let url = cfg.url;
  if (url.startsWith("postgresql://")) {
    url = url.replace(/^postgresql:\/\//, "postgres://");
  }
  sequelize = new Sequelize(url, {
    dialect: "postgres",
    dialectOptions: cfg.dialectOptions,
  });
} else {
  sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, {
    host: cfg.host,
    port: cfg.port,
    dialect: "postgres",
    dialectOptions: cfg.dialectOptions,
  });
}

// Теперь DataTypes определён, и мы можем инициализировать модели:
const { User, AnalysisHistory } = require("./user.model")(sequelize, DataTypes);

const db = {
  Sequelize,
  sequelize,
  User,
  AnalysisHistory,
};

module.exports = db;
