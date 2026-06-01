const express = require("express");
const router = express.Router();

// =========================================
// CONTROLLER
// =========================================
const {
    getClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    getClienteById,
    getKpisCliente,

    // 🔥 NUEVOS
    guardarContacto,
    guardarSucursal

} = require("../controllers/clientes.controller");

// =========================================
// MIDDLEWARE
// =========================================
const authMiddleware = require("../middlewares/auth.middleware");

// =========================================
// RUTAS
// =========================================

// CLIENTES LISTA
router.get(
    "/",
    authMiddleware,
    getClientes
);

// CREAR CLIENTE
router.post(
    "/",
    authMiddleware,
    createCliente
);

// ACTUALIZAR CLIENTE
router.put(
    "/:id",
    authMiddleware,
    updateCliente
);

// ELIMINAR CLIENTE
router.delete(
    "/:id",
    authMiddleware,
    deleteCliente
);

// CLIENTE POR ID
router.get(
    "/:id",
    authMiddleware,
    getClienteById
);

// KPI CLIENTE
router.get(
    "/kpis/:id",
    authMiddleware,
    getKpisCliente
);

// =========================================
// 🔥 NUEVAS RUTAS
// =========================================

// GUARDAR CONTACTO
router.post(
    "/:id/contacto",
    authMiddleware,
    guardarContacto
);

// GUARDAR SUCURSAL
router.post(
    "/:id/sucursal",
    authMiddleware,
    guardarSucursal
);

module.exports = router;
