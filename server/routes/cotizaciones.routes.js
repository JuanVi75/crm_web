const express = require("express");
const router = express.Router();

const {
    getCotizaciones,
    getCotizacionesCliente,
    createCotizacion,
    deleteCotizacion
} = require("../controllers/cotizaciones.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// =========================================
// TODAS LAS COTIZACIONES
// =========================================
router.get(
    "/",
    authMiddleware,
    getCotizaciones
);

// =========================================
// COTIZACIONES POR CLIENTE
// =========================================
router.get(
    "/cliente",
    authMiddleware,
    getCotizacionesCliente
);

// =========================================
// CREAR COTIZACIÓN
// =========================================
router.post(
    "/",
    authMiddleware,
    createCotizacion
);

// =========================================
// ELIMINAR COTIZACIÓN
// =========================================
router.delete(
    "/:doc",
    authMiddleware,
    deleteCotizacion
);

module.exports = router;