const db = require("../config/db");

// =========================================
// GET COTIZACIONES
// =========================================
const getCotizaciones = (req, res) => {

    const sql = `
        SELECT *
        FROM cotizaciones
        ORDER BY fecha DESC
    `;

    db.query(sql, (err, rows) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error SQL" });
        }

        return res.json({ data: rows });
    });
};

// =========================================
// GET POR CLIENTE
// =========================================
const getCotizacionesCliente = (req, res) => {

    const cliente_id = req.query.cliente_id;

    if (!cliente_id) {
        return res.status(400).json({ message: "cliente_id requerido" });
    }

    const sql = `
        SELECT c.*
        FROM cotizaciones c
        WHERE c.id_cliente = ?
        AND NOT EXISTS (
            SELECT 1 FROM pedidos p WHERE p.cot_no = c.doc
        )
        ORDER BY c.fecha DESC
    `;

    db.query(sql, [cliente_id], (err, rows) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error SQL" });
        }

        return res.json({ data: rows });
    });
};

// =========================================
// CREATE COTIZACIÓN
// =========================================
const createCotizacion = (req, res) => {

    const data = req.body;

    const sql = `
        INSERT INTO cotizaciones
        (
            doc,
            fecha,
            id_cliente,
            cliente,
            dcto,
            vta_bruta,
            venta_neta,
            iva,
            otros_imp,
            total,
            asesor
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.doc,
        data.fecha,
        data.id_cliente,
        data.cliente,
        data.dcto,
        data.vta_bruta,
        data.venta_neta,
        data.iva,
        data.otros_imp,
        data.total,
        data.asesor
    ];

    db.query(sql, values, (err) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error guardando cotización"
            });
        }

        return res.json({
            success: true,
            message: "Cotización creada"
        });
    });
};

// =========================================
// DELETE COTIZACIÓN
// =========================================
const deleteCotizacion = (req, res) => {

    const doc = (req.params.doc || "").trim();

    db.query(
        "DELETE FROM cotizaciones WHERE TRIM(doc) = ?",
        [doc],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Error eliminando"
                });
            }

            return res.json({ success: true });
        }
    );
};

// =========================================
// EXPORTS
// =========================================
module.exports = {
    getCotizaciones,
    getCotizacionesCliente,
    createCotizacion,
    deleteCotizacion
};