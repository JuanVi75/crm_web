const express = require("express");
const router = express.Router();

const {
    getSeguimientos,
    createSeguimiento,
    updateSeguimiento,
    deleteSeguimiento,
    getSeguimientoById,
    getReporteSeguimientos,
    getTareasHoy
} = require("../controllers/seguimientos.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// =========================================
// GET TODOS
// =========================================
router.get(
    "/",
    authMiddleware,
    getSeguimientos
);

// =========================================
// REPORTE
// =========================================
router.get(
    "/reporte",
    authMiddleware,
    getReporteSeguimientos
);

// =========================================
// GET POR ID
// =========================================
router.get(
    "/:id",
    authMiddleware,
    getSeguimientoById
);

// =========================================
// CREAR
// =========================================
router.post(
    "/",
    authMiddleware,
    createSeguimiento
);

// =========================================
// ACTUALIZAR
// =========================================
router.put(
    "/:id",
    authMiddleware,
    updateSeguimiento
);

// =========================================
// ELIMINAR
// =========================================
router.delete(
    "/:id",
    authMiddleware,
    deleteSeguimiento
);

router.get(
    "/tareas-hoy",
    authMiddleware,
    getTareasHoy
);

module.exports = router;
