const { Sequelize } = require("sequelize");
const cfg = require("../config/db.config");

let sequelize;
if (cfg.url) {
  // если Supabase даёт нам postgresql://..., заменим его на postgres://
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
  });
}

// и только теперь передаём инициализацию моделей
const { User, AnalysisHistory } = require("./user.model")(sequelize, DataTypes);

// собираем объект для экспорта
const db = {
  Sequelize,
  sequelize,
  User,
  AnalysisHistory,
};

module.exports = db;
