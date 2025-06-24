// models/index.js
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Вычитываем прямо из process.env
const { DATABASE_URL, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } =
  process.env;

let sequelize;

if (DATABASE_URL) {
  // Supabase дает postgresql://…, а sequelize ожидает postgres://…
  const url = DATABASE_URL.replace(/^postgresql:\/\//i, "postgres://");
  sequelize = new Sequelize(url, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        // если самоподписанный сертификат:
        rejectUnauthorized: false,
      },
    },
    logging: false, // можно убрать, если хотите логи SQL
  });
} else {
  // локальное подключение
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST || "localhost",
    port: parseInt(DB_PORT, 10) || 5432,
    dialect: "postgres",
    logging: false,
  });
}

// теперь инициализируем модели:
const { User, AnalysisHistory } = require("./user.model")(sequelize, DataTypes);

const db = { sequelize, Sequelize, User, AnalysisHistory };

module.exports = db;
