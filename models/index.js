// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const cfg = require("../config/db.config");

// создаём подключение
let sequelize;
if (cfg.url) {
  sequelize = new Sequelize(cfg.url, {
    dialect: cfg.dialect,
    dialectOptions: cfg.dialectOptions,
  });
} else {
  sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, {
    host: cfg.host,
    port: cfg.port,
    dialect: cfg.dialect,
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
