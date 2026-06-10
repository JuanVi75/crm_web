const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// FRONTEND CONFIG
app.use("/config", express.static(path.join(__dirname, "../public/config")));

// ROUTES
app.use(require("./routes/departamentos.routes"));

app.listen(4001, () => {
   console.log("✅ server-config activo en puerto 4001");
});
