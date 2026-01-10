require("dotenv").config(); // ← primero de todo
const { logMensaje } = require("../utils/logger.js");

module.exports = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "sanidad_user",
        password: process.env.DB_PASSWORD || "test",
        name: process.env.DB_NAME || "sanidad",
        port: process.env.DB_PORT || 3306,
    },
    secretKey: process.env.SECRET_KEY || "default_secret",
};

logMensaje("DBNAME:", process.env.DB_NAME);
logMensaje("DBHOST:", process.env.DB_HOST);
logMensaje("DBUSER:", process.env.DB_USER);
logMensaje("DBPORT:", process.env.DB_PORT);
logMensaje("NODE_ENV:", process.env.NODE_ENV);