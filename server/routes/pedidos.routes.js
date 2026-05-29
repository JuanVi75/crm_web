const express = require("express");
const router = express.Router();

const {
    getPedidos,
    savePedido,
    deletePedido
} = require("../controllers/pedidos.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// =========================================
// GET PEDIDOS
// =========================================
router.get(
    "/",
    authMiddleware,
    getPedidos
);

// =========================================
// CREATE / UPDATE PEDIDO
// =========================================
router.post(
    "/",
    authMiddleware,
    savePedido
);

// =========================================
// DELETE PEDIDO
// =========================================
router.delete(
    "/:doc",
    authMiddleware,
    deletePedido
);

module.exports = router;