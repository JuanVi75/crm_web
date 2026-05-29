const db = require("../config/db");

// =========================================
// CIUDADES AUTOCOMPLETE
// =========================================
exports.getCiudades = (req, res) => {

    const q = req.query.q || "";

    const sql = `
        SELECT 
            c.id,
            c.municipio AS nombre,
            c.departamento_id,
            d.depto AS departamento
        FROM ciudades c
        LEFT JOIN departamentos d ON d.id = c.departamento_id
        WHERE c.municipio LIKE ?
        ORDER BY c.municipio ASC
        LIMIT 10
    `;

    db.query(sql, [`%${q}%`], (err, rows) => {

        if (err) {
            console.error("Error getCiudades:", err);
            return res.status(500).json([]);
        }

        res.json(rows);
    });
};


// =========================================
// SECTORES AUTOCOMPLETE
// =========================================
exports.getSectores = (req, res) => {

    const q = req.query.q || "";

    const sql = `
        SELECT 
            id,
            sector AS nombre
        FROM sectores
        WHERE sector LIKE ?
        ORDER BY sector ASC
        LIMIT 10
    `;

    db.query(sql, [`%${q}%`], (err, rows) => {

        if (err) {
            console.error("Error getSectores:", err);
            return res.status(500).json([]);
        }

        res.json(rows);
    });
};