const express = require("express");
const router = express.Router();

const {
    getDashboard
} = require("../controllers/dashboardController");

const authMiddleware = require("../middlewares/auth.middleware");

// =====================================
// DASHBOARD
// =====================================
router.get(
    "/",
    authMiddleware,
    getDashboard
);

module.exports = router;