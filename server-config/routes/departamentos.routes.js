const express = require("express");
const router = express.Router();

const db = require("../config/db");

/* =========================
   LISTAR
========================= */
router.get("/", (req, res) => {

    db.query("SELECT * FROM departamentos ORDER BY id", (err, rows) => {

        if (err) {
            return res.status(500).json({ message: err.message });
        }

        res.json({ data: rows });
    });

});

/* =========================
   CREAR
========================= */
router.post("/", (req, res) => {

    const { id, depto } = req.body;

    db.query(
        "INSERT INTO departamentos (id, depto) VALUES (?, ?)",
        [id, depto],
        (err) => {

            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.json({ ok: true });
        }
    );

});

module.exports = router;
