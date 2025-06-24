const { Sequelize } = require("sequelize");
const cfg = require("../config/db.config");

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

// Используем фабрику модели User и AnalysisHistory
const { User, AnalysisHistory } = require("./user.model")(sequelize, DataTypes);

// Собираем объект db
const db = {
  Sequelize,
  sequelize,
  User,
  AnalysisHistory,
};

module.exports = { Sequelize, sequelize, db };
