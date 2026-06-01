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
    guardarSucursal,
    getContactosCliente   // 🔥 FALTABA ESTO
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
// CONTACTOS
// =========================================
router.post("/contactos", authMiddleware, guardarContacto);

router.post("/:id/contacto", authMiddleware, (req, res) => {
    req.body.cliente_id = req.params.id;
    return guardarContacto(req, res);
});

// =========================================
// SUCURSALES
// =========================================
router.post("/sucursales", authMiddleware, guardarSucursal);

router.post("/:id/sucursal", authMiddleware, (req, res) => {
    req.body.cliente_id = req.params.id;
    return guardarSucursal(req, res);
});

module.exports = router;
