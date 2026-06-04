const db = require("../config/db");

// =========================================
// GET SEGUIMIENTOS
// =========================================
const getSeguimientos = (req, res) => {

    const user = req.user || {
        rol: "INVITADO",
        nombre: ""
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    let where = "";
    let params = [];

    if (user.rol === "ASESOR") {
        where = "WHERE s.asesor = ?";
        params.push(user.nombre);
    }

    if (req.query.cliente_id) {
        where += (where ? " AND" : "WHERE") + " s.cliente_id = ?";
        params.push(req.query.cliente_id);
    }

    const sqlTotal = `
        SELECT COUNT(*) AS total
        FROM seguimientos s
        ${where}
    `;

    const sql = `
        SELECT
            s.id,
            s.cliente_id,
            c.cliente,
            s.contacto,
            s.tel_contacto,
            c.ciudad,
            c.sector,
            s.tipo,
            s.nota,
            s.proxima_accion,
            s.fecha_proxima,
            s.fecha,
            c.asesor
        FROM seguimientos s
        LEFT JOIN clientes c
            ON c.id = s.cliente_id
        ${where}
        ORDER BY s.fecha DESC
        LIMIT ? OFFSET ?
    `;

    db.query(sqlTotal, params, (err, totalRows) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error SQL"
            });
        }

        const totalRegistros = totalRows[0].total;
        const totalPaginas = Math.ceil(totalRegistros / limit);

        db.query(
            sql,
            [...params, limit, offset],
            (err, rows) => {

                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: false,
                        message: "Error SQL"
                    });
                }

                return res.json({
                    data: rows,
                    totalRegistros,
                    totalPaginas,
                    paginaActual: page
                });
            }
        );
    });
};

// =========================================
// CREATE SEGUIMIENTO
// =========================================
const createSeguimiento = (req, res) => {

    const data = req.body;

    const sql = `
        INSERT INTO seguimientos
        (
            cliente_id,
            contacto,
            tel_contacto,
            tipo,
            nota,
            proxima_accion,
            fecha_proxima,
            fecha,
            asesor
        )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.cliente_id,
            data.contacto,
            data.tel_contacto,
            data.tipo,
            data.nota,
            data.proxima_accion,
            data.fecha_proxima || null,
            data.fecha,
            data.asesor
        ],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Error guardando seguimiento"
                });
            }

            return res.json({
                success: true,
                message: "Seguimiento creado"
            });
        }
    );
};

// =========================================
// UPDATE SEGUIMIENTO
// =========================================
// =========================================
// UPDATE SEGUIMIENTO
// =========================================
const updateSeguimiento = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE seguimientos
        SET
            estado = 'TERMINADO'
        WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        (err) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Error actualizando"
                });
            }

            return res.json({
                success: true,
                message: "Seguimiento finalizado"
            });
        }
    );
};

// =========================================
// DELETE SEGUIMIENTO
// =========================================
const deleteSeguimiento = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM seguimientos WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false
                });
            }

            return res.json({
                success: true,
                message: "Seguimiento eliminado"
            });
        }
    );
};

// =========================================
// GET BY ID
// =========================================
const getSeguimientoById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            s.id,
            s.cliente_id,
            s.contacto,
            s.tel_contacto,
            s.tipo,
            s.nota,
            s.proxima_accion,
            s.fecha_proxima,
            s.fecha,
            s.estado,

            c.cliente,
            c.ciudad,
            c.sector,
            c.asesor

        FROM seguimientos s
        LEFT JOIN clientes c
            ON c.id = s.cliente_id
        WHERE s.id = ?
        LIMIT 1
    `;

    db.query(sql, [id], (err, rows) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error obteniendo seguimiento"
            });
        }

        return res.json(rows[0] || null);
    });
};

// =========================================
// REPORTE SEGUIMIENTOS
// =========================================
const getReporteSeguimientos = (req, res) => {

    const user = req.user || {
        rol: "INVITADO",
        nombre: ""
    };

    const { inicio, fin } = req.query;

    let sql = `
        SELECT
            s.id,
            s.fecha,
            c.cliente,

            CASE
                WHEN s.contacto IS NULL OR s.contacto = ''
                THEN c.contacto
                ELSE s.contacto
            END AS contacto,

            CASE
                WHEN s.tel_contacto IS NULL OR s.tel_contacto = ''
                THEN c.tel_contacto
                ELSE s.tel_contacto
            END AS tel_contacto,

            c.ciudad,
            c.sector,
            s.tipo,
            s.nota,
            s.proxima_accion,
            s.fecha_proxima,
            s.asesor

        FROM seguimientos s
        LEFT JOIN clientes c ON c.id = s.cliente_id
        WHERE DATE(s.fecha) BETWEEN ? AND ?
    `;

    let params = [inicio, fin];

    // 🔥 FILTRO POR ROL
    if (user.rol === "ASESOR") {
        sql += " AND s.asesor = ?";
        params.push(user.nombre);
    }

    sql += " ORDER BY s.fecha DESC";

    db.query(sql, params, (err, rows) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Error generando reporte"
            });
        }

        return res.json({
            success: true,
            total: rows.length,
            data: rows
        });
    });
};

// =========================================
// TAREAS HOY
// =========================================
// =========================================
// TAREAS CRM
// =========================================
const getTareasHoy = (req, res) => {

    const user = req.user || {
        rol: "INVITADO",
        nombre: ""
    };

    let sql = `
        SELECT
            s.id,
            s.cliente_id,

            c.cliente,
            c.ciudad,

            s.tipo,
            s.nota,
            s.proxima_accion,
            s.fecha_proxima,
            s.fecha,
            s.estado,

            COALESCE(
                s.asesor,
                c.asesor
            ) AS asesor,

            cc.id AS contacto_id,
            cc.nombre AS contacto,
            cc.telefono AS tel_contacto

        FROM seguimientos s

        LEFT JOIN clientes c
            ON c.id = s.cliente_id

        LEFT JOIN cliente_contactos cc
            ON cc.cliente_id = s.cliente_id
            AND cc.estado = 'ACTIVO'

        WHERE
            s.fecha_proxima IS NOT NULL

            AND

            (
                s.estado IS NULL
                OR s.estado = 'ACTIVO'
                OR s.estado = 'STAND BY'
            )
    `;

    let params = [];

    // =========================================
    // FILTRO ASESOR
    // =========================================
    if (user.rol === "ASESOR") {

        sql += `
            AND s.asesor = ?
        `;

        params.push(user.nombre);
    }

    // =========================================
    // ORDEN
    // =========================================
    sql += `
        ORDER BY
            s.fecha_proxima ASC,
            s.fecha ASC
    `;

    db.query(sql, params, (err, rows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Error cargando tareas"
            });
        }

        return res.json({
            success: true,
            total: rows.length,
            data: rows
        });
    });
};

// =========================================
// RESUMEN CALENDARIO
// =========================================
const getResumenCalendario = (req, res) => {

    const user = req.user || {
        rol: "INVITADO",
        nombre: ""
    };

    let sql = `
        SELECT
            DATE(s.fecha_proxima) AS fecha,

            SUM(
                CASE
                    WHEN (
                        s.estado IS NULL
                        OR s.estado = 'ACTIVO'
                        OR s.estado = 'STAND BY'
                    )
                    THEN 1
                    ELSE 0
                END
            ) AS pendientes,

            SUM(
                CASE
                    WHEN s.estado = 'TERMINADO'
                    THEN 1
                    ELSE 0
                END
            ) AS realizados

        FROM seguimientos s

        WHERE s.fecha_proxima IS NOT NULL
    `;

    let params = [];

    // =========================================
    // FILTRO ASESOR
    // =========================================
    if (user.rol === "ASESOR") {

        sql += " AND s.asesor = ?";

        params.push(user.nombre);
    }

    sql += `
        GROUP BY DATE(s.fecha_proxima)
        ORDER BY DATE(s.fecha_proxima) ASC
    `;

    db.query(sql, params, (err, rows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Error calendario"
            });
        }

        return res.json({
            success: true,
            data: rows
        });
    });
};


module.exports = {
    getSeguimientos,
    createSeguimiento,
    updateSeguimiento,
    deleteSeguimiento,
    getSeguimientoById,
    getReporteSeguimientos,
    getTareasHoy,
    getResumenCalendario
};
