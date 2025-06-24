const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config");
const sequelize = new Sequelize(dbConfig.url, {
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
});

const db = {
  Sequelize,
  sequelize,
};

// Подключаем нашу фабрику — она вернёт обе модели
const { User, AnalysisHistory } = require("./user.model")(sequelize, DataTypes);

db.User = User;
db.AnalysisHistory = AnalysisHistory;

module.exports = db;
