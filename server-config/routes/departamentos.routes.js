const express = require("express");
const router = express.Router();

const db = require("../config/db");

/* =========================
   GET TODOS
========================= */
router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM departamentos ORDER BY id",
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: "Error cargando departamentos",
                    error: err.message
                });
            }

            res.json({ data: rows });
        }
    );

});

/* =========================
   CREAR
========================= */
router.post("/", (req, res) => {

    const { id, depto } = req.body;

    if (!id || !depto) {
        return res.status(400).json({
            message: "Datos incompletos"
        });
    }

    db.query(
        "INSERT INTO departamentos (id, depto) VALUES (?, ?)",
        [id, depto],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: "Error creando departamento",
                    error: err.message
                });
            }

            res.json({ message: "OK" });
        }
    );

});

module.exports = router;
