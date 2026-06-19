const express = require("express");
const router = express.Router();

const MensajesController = require("../controllers/whatsappMensajes.controller");

/* =========================
   LISTAR
========================= */
router.get("/", MensajesController.listar);

/* =========================
   STATS
========================= */
router.get("/stats", MensajesController.stats);

/* =========================
   CREAR
========================= */
router.post("/", MensajesController.crear);

/* =========================
   MODIFICAR
========================= */
router.put("/:id", MensajesController.modificar);

/* =========================
   BORRAR
========================= */
router.delete("/:id", MensajesController.borrar);

module.exports = router;