const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../auth.middleware");

/* =========================================
   DEPARTAMENTOS
========================================= */

router.get("/departamentos", auth, async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM departamentos ORDER BY id"
        );

        res.json({ data: rows });

    } catch (err) {
        res.status(500).json({
            message: "Error cargando departamentos",
            error: err.message
        });
    }
});

router.post("/departamentos", auth, async (req, res) => {
    try {
        const { id, depto } = req.body;

        await db.promise().query(
            "INSERT INTO departamentos (id, depto) VALUES (?, ?)",
            [id, depto]
        );

        res.json({ message: "Departamento creado" });

    } catch (err) {
        res.status(500).json({
            message: "Error creando departamento",
            error: err.message
        });
    }
});

/* =========================================
   CIUDADES (CODIGO COMPUESTO)
========================================= */

router.get("/ciudades", auth, async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            "SELECT * FROM ciudades ORDER BY id"
        );

        res.json({ data: rows });

    } catch (err) {
        res.status(500).json({
            message: "Error cargando ciudades",
            error: err.message
        });
    }
});

router.post("/ciudades", auth, async (req, res) => {
    try {

        const { id_depto, consecutivo, municipio } = req.body;

        const id = `${id_depto}${String(consecutivo).padStart(2, "0")}`;

        await db.promise().query(
            "INSERT INTO ciudades (id, municipio, id_depto) VALUES (?, ?, ?)",
            [id, municipio, id_depto]
        );

        res.json({
            message: "Ciudad creada",
            id
        });

    } catch (err) {
        res.status(500).json({
            message: "Error creando ciudad",
            error: err.message
        });
    }
});

/* =========================================
   CONTACTOS CLIENTE
========================================= */

router.get("/contactos/:cliente_id", auth, async (req, res) => {
    try {

        const [rows] = await db.promise().query(
            "SELECT * FROM cliente_contactos WHERE cliente_id = ?",
            [req.params.cliente_id]
        );

        res.json({ data: rows });

    } catch (err) {
        res.status(500).json({
            message: "Error contactos",
            error: err.message
        });
    }
});

router.post("/contactos", auth, async (req, res) => {
    try {

        const {
            cliente_id,
            nombre,
            cargo,
            telefono,
            email,
            tipo
        } = req.body;

        await db.promise().query(
            `INSERT INTO cliente_contactos
            (cliente_id, nombre, cargo, telefono, email, tipo)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [cliente_id, nombre, cargo, telefono, email, tipo]
        );

        res.json({ message: "Contacto creado" });

    } catch (err) {
        res.status(500).json({
            message: "Error creando contacto",
            error: err.message
        });
    }
});

/* =========================================
   SUCURSALES CLIENTE
========================================= */

router.get("/sucursales/:cliente_id", auth, async (req, res) => {
    try {

        const [rows] = await db.promise().query(
            "SELECT * FROM cliente_sucursales WHERE cliente_id = ?",
            [req.params.cliente_id]
        );

        res.json({ data: rows });

    } catch (err) {
        res.status(500).json({
            message: "Error sucursales",
            error: err.message
        });
    }
});

router.post("/sucursales", auth, async (req, res) => {
    try {

        const {
            cliente_id,
            nombre,
            ciudad,
            direccion,
            telefono,
            contacto
        } = req.body;

        await db.promise().query(
            `INSERT INTO cliente_sucursales
            (cliente_id, nombre, ciudad, direccion, telefono, contacto)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [cliente_id, nombre, ciudad, direccion, telefono, contacto]
        );

        res.json({ message: "Sucursal creada" });

    } catch (err) {
        res.status(500).json({
            message: "Error creando sucursal",
            error: err.message
        });
    }
});

module.exports = router;