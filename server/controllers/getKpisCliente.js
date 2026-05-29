const db = require("../config/db");

const getKpisCliente = (req, res) => {

    const clienteId = req.params.id;

    const sql = `
        SELECT

        (SELECT COUNT(*) FROM seguimientos WHERE cliente_id = ?) AS seguimientos,

        (SELECT COUNT(*) FROM cotizaciones WHERE cliente_id = ?) AS cotizaciones,
        (SELECT COALESCE(SUM(venta_neta),0) FROM cotizaciones WHERE cliente_id = ?) AS valor_cotizado,

        (SELECT COUNT(*) FROM pedidos WHERE cliente_id = ?) AS pedidos,
        (SELECT COALESCE(SUM(venta_neta),0) FROM pedidos WHERE cliente_id = ?) AS valor_pedidos

    `;

    db.query(
        sql,
        [clienteId, clienteId, clienteId, clienteId, clienteId],
        (err, result) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error KPIs cliente" });
            }

            return res.json(result[0]);
        }
    );
};

module.exports = { getKpisCliente };