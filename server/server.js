const express = require("express");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");

const db = require("./config/db");

const clientesRoutes = require("./routes/clientes.routes");
const catalogoRoutes = require("./routes/catalogo.routes");
const dashboardRoutes = require("./routes/dashboard");
const seguimientosRoutes = require("./routes/seguimientos.routes");
const cotizacionesRoutes = require("./routes/cotizaciones.routes");
const pedidosRoutes = require("./routes/pedidos.routes");

const configuracionesRoutes = require("./routes/configuraciones.routes");

const PORT = process.env.PORT || 3000;

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cors({ origin: "*" }));
app.use(express.json());

/* =========================
   DB GUARD (EVITA CAÍDA POR CONEXIÓN)
========================= */
app.use((req, res, next) => {
    req.db = db;
    next();
});

/* =========================
   FRONTEND
========================= */
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

/* =========================
   AUTH
========================= */
app.post("/api/auth/register", (req, res) => {

    const { usuario, nombre, email, password, rol } = req.body;

    const sql = `
        INSERT INTO usuarios
        (usuario, nombre, email, password, rol, estado)
        VALUES (?, ?, ?, ?, ?, 'ACTIVO')
    `;

    db.query(sql, [usuario, nombre, email, password, rol], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error en registro"
            });
        }

        return res.json({
            success: true,
            message: "Usuario registrado correctamente"
        });
    });
});

app.post("/api/auth/login", (req, res) => {

    const { usuario, password } = req.body;

    const sql = `
        SELECT *
        FROM usuarios
        WHERE usuario = ?
        AND password = ?
        AND estado = 'ACTIVO'
        LIMIT 1
    `;

    db.query(sql, [usuario, password], (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error en login"
            });
        }

        if (!results.length) {
            return res.status(401).json({
                success: false,
                message: "Credenciales inválidas"
            });
        }

        const user = results[0];

        const token = jwt.sign(
            {
                id: user.id,
                nombre: user.nombre,
                rol: user.rol
            },
            process.env.JWT_SECRET || "CHANGE_THIS_SECRET",
            { expiresIn: "8h" }
        );

        return res.json({
            success: true,
            token,
            user
        });
    });
});

app.get("/api/auth/guest", (req, res) => {
    res.json({ success: true });
});

/* =========================
   ROUTES PRINCIPALES
========================= */
app.use("/api/clientes", clientesRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/seguimientos", seguimientosRoutes);
app.use("/api/cotizaciones", cotizacionesRoutes);
app.use("/api/pedidos", pedidosRoutes);

/* =========================
   CONFIGURACIONES (IMPORTANTE: PROTEGIDO)
========================= */
app.use("/api/configuraciones", configuracionesRoutes);

/* =========================
   ERROR GLOBAL (EVITA CAÍDA DEL SERVER)
========================= */
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
        success: false,
        message: "Error interno del servidor"
    });
});

/* =========================
   START
========================= */
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
