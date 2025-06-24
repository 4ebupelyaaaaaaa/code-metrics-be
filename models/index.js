const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

// Инициализируем Sequelize с параметрами из конфига
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
  }
);

// Используем фабрику модели User и AnalysisHistory
const { User, AnalysisHistory } = require("./user.model")(sequelize, DataTypes);

// Собираем объект db
const db = {
  Sequelize,
  sequelize,
  User,
  AnalysisHistory,
};

module.exports = db;
