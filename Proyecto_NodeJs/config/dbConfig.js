const mysql = require('mysql2/promise');
const config = require('./config'); // ← importa tu archivo actual

// Crear pool de conexiones usando tu config
const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    port: config.db.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Wrapper para usar pool.query con async/await
async function query(sql, params) {
    const [rows] = await pool.query(sql, params);
    return rows;
}

module.exports = { query };