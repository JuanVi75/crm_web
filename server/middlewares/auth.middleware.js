const jwt = require("jsonwebtoken");

// =========================================
// AUTH MIDDLEWARE
// =========================================
module.exports = (req, res, next) => {

    try {

        const authHeader =
            req.headers.authorization || "";

        const token =
            authHeader.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : null;

        // =========================================
        // INVITADO
        // =========================================
        if (!token) {

            req.user = {
                rol: "INVITADO",
                nombre: "INVITADO"
            };

            return next();
        }

        // =========================================
        // VERIFY TOKEN
        // =========================================
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret_key"
        );

        req.user = {
            id: decoded.id,
            nombre: decoded.nombre,
            rol: decoded.rol
        };

        return next();

    } catch (error) {

        // =========================================
        // TOKEN EXPIRADO
        // =========================================
        if (error.name === "TokenExpiredError") {

            req.user = {
                rol: "INVITADO",
                nombre: "INVITADO"
            };

            return next();
        }

        // =========================================
        // OTROS ERRORES JWT
        // =========================================
        console.error("AUTH ERROR:", error);

        req.user = {
            rol: "INVITADO",
            nombre: "INVITADO"
        };

        return next();
    }
};