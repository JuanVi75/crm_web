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

    guardarContacto,
    guardarSucursal

} = require("../controllers/clientes.controller");

// =========================================
// MIDDLEWARE
// =========================================
const authMiddleware = require("../middlewares/auth.middleware");

// =========================================
// CLIENTES
// =========================================
router.get("/", authMiddleware, getClientes);

router.post("/", authMiddleware, createCliente);

router.get("/:id/contactos", authMiddleware, getContactosCliente);

router.put("/:id", authMiddleware, updateCliente);

router.delete("/:id", authMiddleware, deleteCliente);

router.get("/:id", authMiddleware, getClienteById);

router.get("/kpis/:id", authMiddleware, getKpisCliente);

// =========================================
// CONTACTOS (NUEVO - FRONTEND COMPATIBLE)
// =========================================
router.post("/contactos", authMiddleware, guardarContacto);

// Compatibilidad con tu sistema antiguo (opcional)
router.post("/:id/contacto", authMiddleware, (req, res) => {
    req.body.cliente_id = req.params.id;
    return guardarContacto(req, res);
});

// =========================================
// SUCURSALES (NUEVO - FRONTEND COMPATIBLE)
// =========================================
router.post("/sucursales", authMiddleware, guardarSucursal);

// Compatibilidad sistema antiguo
router.post("/:id/sucursal", authMiddleware, (req, res) => {
    req.body.cliente_id = req.params.id;
    return guardarSucursal(req, res);
});



module.exports = router;
