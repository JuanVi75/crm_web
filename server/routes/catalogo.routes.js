const express = require("express");
const router = express.Router();

const db = require("../config/db");

// =========================================
// BUSCAR CIUDADES
// =========================================
router.get("/ciudades", (req, res) => {

    const q = req.query.q || "";

    const sql = `
        SELECT 
            c.id,
            c.municipio,
            c.id_depto,
            d.depto
        FROM ciudades c
        LEFT JOIN departamentos d
            ON d.id = c.id_depto
        WHERE c.municipio LIKE ?
        ORDER BY c.municipio ASC
        LIMIT 20
    `;

    db.query(
        sql,
        [`%${q}%`],
        (err, rows) => {

            if (err) {

                console.error(err);

                return res.status(500).json([]);
            }

            res.json(rows);
        }
    );
});

// =========================================
// BUSCAR SECTORES
// =========================================
router.get("/sectores", (req, res) => {

    const q = req.query.q || "";

    const sql = `
        SELECT 
            id,
            sector,
            subcategoria
        FROM sectores
        WHERE subcategoria LIKE ?
        OR sector LIKE ?
        ORDER BY subcategoria ASC
        LIMIT 20
    `;

    db.query(
        sql,
        [`%${q}%`, `%${q}%`],
        (err, rows) => {

            if (err) {

                console.error(err);

                return res.status(500).json([]);
            }

            res.json(rows);
        }
    );
});

module.exports = router;