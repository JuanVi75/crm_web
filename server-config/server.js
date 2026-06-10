const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = require("./config/db");

/* =========================
   FRONTEND CONFIG
========================= */
app.use("/config", express.static("../public/config"));

/* =========================
   API CONFIG (MISMO DOMINIO)
========================= */
app.use("/config-api/departamentos", require("./routes/departamentos.routes"));

/* =========================
   HEALTH
========================= */
app.get("/", (req, res) => {
   res.json({ message: "CONFIG SERVER OK" });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
   console.log("CONFIG SERVER RUNNING");
});
