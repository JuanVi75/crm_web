const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/* =========================
   TEST CONEXIÓN
========================= */
db.getConnection((err, connection) => {

    if (err) {
        console.error("❌ Error conectando a MySQL:", err.message);
        return;
    }

    if (connection) connection.release();

    console.log("✅ Conectado correctamente a la base de datos CONFIG");
});

module.exports = db;
