require("dotenv").config();

if (process.env.DATABASE_URL) {
  // prod: используем единый URL
  module.exports = {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
} else {
  // локально
  module.exports = {
    host: process.env.DB_HOST || "localhost",
    port: +process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "postgres",
  };
}
