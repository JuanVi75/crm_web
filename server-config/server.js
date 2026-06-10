const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   DB CONNECTION
========================= */
const db = require("./config/db");

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
   res.json({
      message: "CONFIG SERVER RUNNING",
      status: "OK"
   });
});

/* =========================
   ROUTES
========================= */

app.use("/api/departamentos", require("./routes/departamentos.routes"));
app.use("/api/ciudades", require("./routes/ciudades.routes"));
app.use("/api/contactos", require("./routes/contactos.routes"));
app.use("/api/sucursales", require("./routes/sucursales.routes"));
app.use("/api/sectores", require("./routes/sectores.routes"));
app.use("/api/whatsapp", require("./routes/whatsapp.routes"));

/* =========================
   START
========================= */
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
   console.log(`CONFIG SERVER RUNNING ON PORT ${PORT}`);
});