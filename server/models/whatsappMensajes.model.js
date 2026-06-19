const db = require("../config/db");

/* =========================
   LISTAR
========================= */
function listarMensajes(callback) {

   const sql = `
      SELECT
         id,
         nombre,
         mensaje,
         target,
         etapa,
         estado,
         creado_por,
         fecha_creacion,
         updated_at
      FROM config_whatsapp_mensajes
      WHERE is_deleted = 0
      ORDER BY fecha_creacion DESC
   `;

   db.query(sql, (err, results) => {
      callback(err, results);
   });
}

/* =========================
   CREAR
========================= */
function crearMensaje(data, callback) {

   const {
      nombre,
      mensaje,
      target,
      etapa,
      estado,
      creado_por
   } = data;

   const sql = `
      INSERT INTO config_whatsapp_mensajes (
         nombre,
         mensaje,
         target,
         etapa,
         estado,
         creado_por,
         fecha_creacion,
         is_deleted
      )
      VALUES (
         ?, ?, ?, ?, ?, ?, NOW(), 0
      )
   `;

   db.query(
      sql,
      [
         nombre,
         mensaje,
         target,
         etapa,
         estado,
         creado_por
      ],
      (err, result) => {
         callback(err, result);
      }
   );
}

/* =========================
   MODIFICAR
========================= */
function modificarMensaje(id, data, callback) {

   const {
      nombre,
      mensaje,
      target,
      etapa,
      estado
   } = data;

   const sql = `
      UPDATE config_whatsapp_mensajes
      SET
         nombre = ?,
         mensaje = ?,
         target = ?,
         etapa = ?,
         estado = ?,
         updated_at = NOW()
      WHERE id = ?
      AND is_deleted = 0
   `;

   db.query(
      sql,
      [
         nombre,
         mensaje,
         target,
         etapa,
         estado,
         id
      ],
      (err, result) => {
         callback(err, result);
      }
   );
}

/* =========================
   BORRAR (SOFT DELETE)
========================= */
function borrarMensaje(id, callback) {

   const sql = `
      UPDATE config_whatsapp_mensajes
      SET
         is_deleted = 1,
         deleted_at = NOW()
      WHERE id = ?
   `;

   db.query(sql, [id], (err, result) => {
      callback(err, result);
   });
}

/* =========================
   STATS
========================= */
function stats(callback) {

   const sql = `
      SELECT
         COUNT(*) AS total,

         SUM(
            CASE
               WHEN DATE(fecha_creacion)=CURDATE()
               THEN 1
               ELSE 0
            END
         ) AS ingresados_hoy,

         SUM(
            CASE
               WHEN DATE(updated_at)=CURDATE()
               THEN 1
               ELSE 0
            END
         ) AS modificados_hoy,

         SUM(
            CASE
               WHEN DATE(deleted_at)=CURDATE()
               THEN 1
               ELSE 0
            END
         ) AS eliminados_hoy,

         GREATEST(
            COALESCE(MAX(fecha_creacion),'2026-06-01'),
            COALESCE(MAX(updated_at),'2026-06-01'),
            COALESCE(MAX(deleted_at),'2026-06-01')
         ) AS ultima_actualizacion

      FROM config_whatsapp_mensajes
      WHERE is_deleted = 0
   `;

   db.query(sql, (err, result) => {

      if (err) {
         return callback(err);
      }

      callback(null, result[0]);
   });
}

module.exports = {
   listarMensajes,
   crearMensaje,
   modificarMensaje,
   borrarMensaje,
   stats
};