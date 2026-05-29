module.exports = function (rolesPermitidos = []) {

    return (req, res, next) => {

        try {

            const user = req.user;

            if (!user) {

                return res.status(401).json({
                    success: false,
                    message: "Usuario no autenticado"
                });
            }

            // validar si el rol está permitido
            if (!rolesPermitidos.includes(user.rol)) {

                return res.status(403).json({
                    success: false,
                    message: "No tienes permisos para esta acción"
                });
            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Error de autorización"
            });
        }
    };
};