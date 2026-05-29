const db = require("../config/db");

const getDashboard = (req, res) => {

    const user = req.user || {
        rol: "INVITADO",
        nombre: ""
    };

    let paramsClientes = [];
    let whereClientes = "";

    if (user.rol === "ASESOR") {
        whereClientes = "WHERE asesor = ?";
        paramsClientes.push(user.nombre);
    }

    const sqlClientes = `
        SELECT COUNT(*) AS total
        FROM clientes
        ${whereClientes}
    `;

    const sqlSeguimientosHoy = `
        SELECT COUNT(*) AS total
        FROM seguimientos
        WHERE DATE(fecha) = CURDATE()
    `;

    const sqlSeguimientosPendientes = `
        SELECT COUNT(*) AS total
        FROM seguimientos
        WHERE fecha_proxima IS NOT NULL
        AND fecha_proxima <= DATE_ADD(CURDATE(), INTERVAL 5 DAY)
    `;

    const sqlClientesActivos = `
        SELECT COUNT(*) AS total
        FROM clientes
        WHERE estado = 'ACTIVO'
    `;

    const sqlCotizacionesTotal = `
        SELECT
            COUNT(*) AS total,
            COALESCE(SUM(venta_neta), 0) AS valor
        FROM cotizaciones
    `;

    const sqlCotizacionesHoy = `
        SELECT
            COUNT(*) AS total,
            COALESCE(SUM(venta_neta), 0) AS valor
        FROM cotizaciones
        WHERE DATE(fecha) = CURDATE()
    `;

    const sqlPedidosTotal = `
        SELECT
            COUNT(*) AS total,
            COALESCE(SUM(venta_neta), 0) AS valor
        FROM pedidos
    `;

    const sqlPedidosHoy = `
        SELECT
            COUNT(*) AS total,
            COALESCE(SUM(venta_neta), 0) AS valor
        FROM pedidos
        WHERE DATE(fecha) = CURDATE()
    `;

    const result = {};

    db.query(sqlClientes, paramsClientes, (err, r1) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error clientes" });
        }

        result.totalClientes = r1[0].total;

        db.query(sqlSeguimientosHoy, (err, r2) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error hoy" });
            }

            result.seguimientosHoy = r2[0].total;

            db.query(sqlSeguimientosPendientes, (err, r3) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Error pendientes" });
                }

                result.seguimientosPendientes = r3[0].total;

                db.query(sqlClientesActivos, (err, r4) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: "Error activos" });
                    }

                    result.clientesActivos = r4[0].total;

                    db.query(sqlCotizacionesTotal, (err, r5) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: "Error cotizaciones" });
                        }

                        result.cotizacionesTotal = r5[0].total || 0;
                        result.valorCotizaciones = r5[0].valor || 0;

                        db.query(sqlCotizacionesHoy, (err, r6) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ error: "Error cotizaciones hoy" });
                            }

                            result.cotizacionesHoy = r6[0].total || 0;
                            result.valorCotizacionesHoy = r6[0].valor || 0;

                            db.query(sqlPedidosTotal, (err, r7) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({ error: "Error pedidos" });
                                }

                                result.pedidosTotal = r7[0].total || 0;
                                result.valorPedidos = r7[0].valor || 0;

                                db.query(sqlPedidosHoy, (err, r8) => {
                                    if (err) {
                                        console.error(err);
                                        return res.status(500).json({ error: "Error pedidos hoy" });
                                    }

                                    result.pedidosHoy = r8[0].total || 0;
                                    result.valorPedidosHoy = r8[0].valor || 0;

                                    return res.json(result);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = {
    getDashboard
};