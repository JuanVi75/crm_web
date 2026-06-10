const express = require("express");
const router = express.Router();

const db = require("../config/db");
const auth = require("../middleware/auth.middleware");

/* =========================================
   DEPARTAMENTOS
========================================= */

router.get("/departamentos", auth, (req, res) => {
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

router.post("/departamentos", auth, (req, res) => {
    const { id, depto } = req.body;

    if (!id || !depto) {
        return res.status(400).json({ message: "Datos incompletos" });
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

/* =========================================
   CIUDADES
========================================= */

router.get("/ciudades", auth, (req, res) => {
    db.query(
        "SELECT * FROM ciudades ORDER BY id",
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: "Error cargando ciudades",
                    error: err.message
                });
            }

            res.json({ data: rows });
        }
    );
});

router.post("/ciudades", auth, (req, res) => {
    const { id_depto, municipio } = req.body;

    if (!id_depto || !municipio) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    const id = `${id_depto}${Math.floor(Math.random() * 90 + 10)}`;

    db.query(
        "INSERT INTO ciudades (id, municipio, id_depto) VALUES (?, ?, ?)",
        [id, municipio, id_depto],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Error creando ciudad",
                    error: err.message
                });
            }

            res.json({ message: "OK", id });
        }
    );
});

/* =========================================
   CONTACTOS CLIENTE
========================================= */

router.post("/cliente_contactos", auth, (req, res) => {
    const {
        cliente_id,
        nombre,
        cargo,
        telefono,
        email
    } = req.body;

    if (!cliente_id || !nombre) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    db.query(
        `INSERT INTO cliente_contactos
        (cliente_id, nombre, cargo, telefono, email)
        VALUES (?, ?, ?, ?, ?)`,
        [cliente_id, nombre, cargo, telefono, email],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Error creando contacto",
                    error: err.message
                });
            }

            res.json({ message: "OK" });
        }
    );
});

/* =========================================
   SUCURSALES CLIENTE
========================================= */

router.post("/cliente_sucursales", auth, (req, res) => {
    const {
        cliente_id,
        nombre,
        ciudad,
        direccion,
        telefono
    } = req.body;

    if (!cliente_id || !nombre) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    db.query(
        `INSERT INTO cliente_sucursales
        (cliente_id, nombre, ciudad, direccion, telefono)
        VALUES (?, ?, ?, ?, ?)`,
        [cliente_id, nombre, ciudad, direccion, telefono],
        (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Error creando sucursal",
                    error: err.message
                });
            }

            res.json({ message: "OK" });
        }
    );
});

module.exports = router;