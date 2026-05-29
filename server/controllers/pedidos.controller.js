const db = require("../config/db");

// =========================================
// GET PEDIDOS
// =========================================
const getPedidos = (req, res) => {

    const cliente_id = req.query.cliente_id;

    let params = [];
    let where = "";

    if (cliente_id) {
        where = "WHERE p.id_cliente = ?";
        params.push(cliente_id);
    }

    const sql = `
        SELECT
            p.doc,
            p.fecha,
            p.id_cliente,
            p.cliente,
            p.cot_no,
            p.total,
            p.venta_neta,
            p.iva,
            p.otros_imp,
            p.asesor
        FROM pedidos p
        ${where}
        ORDER BY p.fecha DESC
    `;

    db.query(sql, params, (err, rows) => {

        if (err) {
            console.error("ERROR SQL PEDIDOS:", err);
            return res.status(500).json({
                success: false,
                message: "Error SQL pedidos"
            });
        }

        return res.json({
            success: true,
            data: rows
        });
    });
};

// =========================================
// CREATE / UPDATE PEDIDO
// =========================================
const savePedido = (req, res) => {

    const {
        doc,
        fecha,
        id_cliente,
        cliente,
        cot_no,
        total,
        venta_neta,
        iva,
        otros_imp,
        asesor
    } = req.body;

    if (!doc) {
        return res.status(400).json({
            success: false,
            message: "Documento requerido"
        });
    }

    const sqlCheck = "SELECT doc FROM pedidos WHERE doc = ?";

    db.query(sqlCheck, [doc], (err, rows) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }

        if (rows.length > 0) {

            const sqlUpdate = `
                UPDATE pedidos SET
                    fecha = ?,
                    id_cliente = ?,
                    cliente = ?,
                    cot_no = ?,
                    total = ?,
                    venta_neta = ?,
                    iva = ?,
                    otros_imp = ?,
                    asesor = ?
                WHERE doc = ?
            `;

            db.query(sqlUpdate, [
                fecha,
                id_cliente,
                cliente,
                cot_no,
                total,
                venta_neta,
                iva,
                otros_imp,
                asesor,
                doc
            ], (err2) => {

                if (err2) {
                    console.error(err2);
                    return res.status(500).json({ success: false });
                }

                return res.json({
                    success: true,
                    message: "Pedido actualizado"
                });
            });

        } else {

            const sqlInsert = `
                INSERT INTO pedidos (
                    doc,
                    fecha,
                    id_cliente,
                    cliente,
                    cot_no,
                    total,
                    venta_neta,
                    iva,
                    otros_imp,
                    asesor
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(sqlInsert, [
                doc,
                fecha,
                id_cliente,
                cliente,
                cot_no,
                total,
                venta_neta,
                iva,
                otros_imp,
                asesor
            ], (err3) => {

                if (err3) {
                    console.error(err3);
                    return res.status(500).json({ success: false });
                }

                return res.json({
                    success: true,
                    message: "Pedido creado"
                });
            });
        }
    });
};

// =========================================
// DELETE PEDIDO
// =========================================
const deletePedido = (req, res) => {

    const doc = req.params.doc;

    if (!doc) {
        return res.status(400).json({
            success: false,
            message: "Documento requerido"
        });
    }

    db.query(
        "DELETE FROM pedidos WHERE doc = ?",
        [doc],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Error eliminando pedido"
                });
            }

            return res.json({
                success: true,
                message: "Pedido eliminado"
            });
        }
    );
};

module.exports = {
    getPedidos,
    savePedido,
    deletePedido
};