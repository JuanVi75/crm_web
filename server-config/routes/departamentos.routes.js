const express = require("express");
const router = express.Router();
const db = require("../config/db");

// LISTAR
router.get("/departamentos", (req, res) => {
    db.query("SELECT * FROM departamentos", (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// CREAR
router.post("/departamentos", (req, res) => {

    const { id, depto } = req.body;

    db.query(
        "INSERT INTO departamentos (id, depto) VALUES (?, ?)",
        [id, depto],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ ok: true });
        }
    );
});

module.exports = router;
