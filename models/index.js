// models/index.js
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// 1) Строка подключения: либо из DATABASE_URL, либо склеиваем локальную
let connectionString;
if (process.env.DATABASE_URL) {
  // Supabase даёт postgresql://… → меняем на postgres://…
  connectionString = process.env.DATABASE_URL.replace(
    /^postgresql:\/\//,
    "postgres://"
  );
} else {
  // локальная сборка
  const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST = "localhost",
    DB_PORT = 5432,
    DB_NAME,
  } = process.env;
  connectionString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

// 2) Инициализируем Sequelize
const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: process.env.DATABASE_URL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  logging: false, // отключаем лишние логи
});

// 3) Импорт моделей
const userFactory = require("./user.model");
const { User, AnalysisHistory } = userFactory(sequelize, DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
  AnalysisHistory,
};

module.exports = db;
