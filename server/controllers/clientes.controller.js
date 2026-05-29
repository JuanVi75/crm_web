const db = require("../config/db");

// =========================================
// CIUDADES
// =========================================
const buscarCiudades = (req, res) => {

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

    db.query(sql, [`%${q}%`], (err, rows) => {

        if (err) {
            console.error(err);
            return res.status(500).json([]);
        }

        return res.json(rows);
    });
};

// =========================================
// SECTORES
// =========================================
const buscarSectores = (req, res) => {

    const q = req.query.q || "";

    const sql = `
        SELECT
            id,
            sector,
            subcategoria
        FROM sectores
        WHERE subcategoria LIKE ?
        ORDER BY subcategoria ASC
        LIMIT 20
    `;

    db.query(sql, [`%${q}%`], (err, rows) => {

        if (err) {
            console.error(err);
            return res.status(500).json([]);
        }

        return res.json(rows);
    });
};

// =========================================
// GET CLIENTES
// =========================================
const getClientes = (req, res) => {

    const user = req.user || {
        rol: "INVITADO",
        nombre: ""
    };

    const page = parseInt(req.query.page) || 1;

    const isAutocomplete = req.query.autocomplete === "1";

    let limit = parseInt(req.query.limit) || 100;
    if (isAutocomplete) limit = 2000;

    const offset = (page - 1) * limit;

    const q = req.query.q || "";

    let sql = `
        SELECT
            c.id,
            c.cliente,
            c.direccion,
            c.telefono,
            c.ciudad,
            c.departamento,
            c.email,
            c.sector,
            c.contacto,
            c.tel_contacto,
            c.asesor,
            c.maneja_sucursales
        FROM clientes c
    `;

    let countSql = `
        SELECT COUNT(*) AS total
        FROM clientes c
    `;

    let where = [];
    let params = [];

    if (user.rol === "ASESOR") {
        where.push("c.asesor = ?");
        params.push(user.nombre);
    }

    if (q) {
        where.push("c.cliente LIKE ?");
        params.push(`%${q}%`);
    }

    if (where.length > 0) {
        sql += " WHERE " + where.join(" AND ");
        countSql += " WHERE " + where.join(" AND ");
    }

    db.query(countSql, params, (errCount, countResult) => {

        if (errCount) {
            console.error(errCount);
            return res.status(500).json({
                success: false,
                message: "Error COUNT"
            });
        }

        const total = countResult[0].total;

        sql += `
            ORDER BY c.fecha_creacion DESC
            LIMIT ? OFFSET ?
        `;

        db.query(sql, [...params, limit, offset], (err, rows) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Error SQL"
                });
            }

            return res.json({
                data: rows,
                total
            });
        });
    });
};

// =========================================
// CREATE CLIENTE
// =========================================
const createCliente = (req, res) => {

    const data = req.body;

    const sql = `
        INSERT INTO clientes
        (
            id,
            cliente,
            direccion,
            telefono,
            ciudad,
            departamento,
            ciudad_id,
            departamento_id,
            email,
            sector,
            sector_id,
            contacto,
            tel_contacto,
            asesor,
            maneja_sucursales,
            estado
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.id || null,
        data.cliente || "",
        data.direccion || "",
        data.telefono || "",
        data.ciudad || "",
        data.departamento || "",
        data.ciudad_id || null,
        data.departamento_id || null,
        data.email || "",
        data.sector || "",
        data.sector_id || null,
        data.contacto || "",
        data.tel_contacto || "",
        data.asesor || "",
        data.maneja_sucursales || "NO",
        "ACTIVO"
    ];

    db.query(sql, values, (err) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error creando cliente"
            });
        }

        return res.json({
            success: true,
            message: "Cliente creado"
        });
    });
};

// =========================================
// UPDATE CLIENTE
// =========================================
const updateCliente = (req, res) => {

    const { id } = req.params;
    const data = req.body;

    const sql = `
        UPDATE clientes
        SET
            cliente = ?,
            direccion = ?,
            telefono = ?,
            ciudad = ?,
            departamento = ?,
            ciudad_id = ?,
            departamento_id = ?,
            email = ?,
            sector = ?,
            sector_id = ?,
            contacto = ?,
            tel_contacto = ?,
            asesor = ?,
            maneja_sucursales = ?
        WHERE id = ?
    `;

    const values = [
        data.cliente || "",
        data.direccion || "",
        data.telefono || "",
        data.ciudad || "",
        data.departamento || "",
        data.ciudad_id || null,
        data.departamento_id || null,
        data.email || "",
        data.sector || "",
        data.sector_id || null,
        data.contacto || "",
        data.tel_contacto || "",
        data.asesor || "",
        data.maneja_sucursales || "NO",
        id
    ];

    db.query(sql, values, (err) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error actualizando"
            });
        }

        return res.json({ success: true });
    });
};

// =========================================
// DELETE CLIENTE
// =========================================
const deleteCliente = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM clientes WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }

            return res.json({ success: true });
        }
    );
};

// =========================================
// GET CLIENTE BY ID
// =========================================
const getClienteById = (req, res) => {

    const { id } = req.params;

    db.query(
        "SELECT * FROM clientes WHERE id = ?",
        [id],
        (err, rows) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }

            return res.json(rows[0] || null);
        }
    );
};

// =========================================
// EXPORTS
// =========================================
module.exports = {
    getClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    getClienteById,
    buscarCiudades,
    buscarSectores,
    getKpisCliente: require("./getKpisCliente").getKpisCliente
};