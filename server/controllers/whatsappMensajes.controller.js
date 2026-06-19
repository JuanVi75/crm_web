const MensajesModel = require("../models/whatsappMensajes.model");

/* =========================
   LISTAR
========================= */
exports.listar = (req, res) => {

   MensajesModel.listarMensajes((err, results) => {

      if (err) {
         console.error(err);
         return res.status(500).json({
            error: "Error al listar mensajes"
         });
      }

      res.json(results);
   });
};

/* =========================
   CREAR
========================= */
exports.crear = (req, res) => {

   MensajesModel.crearMensaje(req.body, (err, result) => {

      if (err) {
         console.error(err);
         return res.status(500).json({
            error: "Error al crear mensaje"
         });
      }

      res.status(201).json({
         success: true,
         id: result.insertId
      });
   });
};

/* =========================
   MODIFICAR
========================= */
exports.modificar = (req, res) => {

   const { id } = req.params;

   MensajesModel.modificarMensaje(id, req.body, (err, result) => {

      if (err) {
         console.error(err);
         return res.status(500).json({
            error: "Error al modificar mensaje"
         });
      }

      res.json({
         success: true
      });
   });
};

/* =========================
   BORRAR
========================= */
exports.borrar = (req, res) => {

   const { id } = req.params;

   MensajesModel.borrarMensaje(id, (err, result) => {

      if (err) {
         console.error(err);
         return res.status(500).json({
            error: "Error al eliminar mensaje"
         });
      }

      res.json({
         success: true
      });
   });
};

/* =========================
   STATS
========================= */
exports.stats = (req, res) => {

   MensajesModel.stats((err, result) => {

      if (err) {
         console.error(err);
         return res.status(500).json({
            error: "Error al obtener estadísticas"
         });
      }

      res.json(result);
   });
};