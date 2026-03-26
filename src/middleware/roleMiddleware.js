/**
 * Middleware para restringir acceso según el rol del usuario.
 * @param  {...String} rolesPermitidos - Lista de roles que pueden pasar (admin, vendedor, etc.)
 */
const autorizarRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        // 1. Verificar si el usuario existe en la petición (inyectado por el authMiddleware)
        if (!req.user) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'No hay sesión activa. Autenticación requerida.' 
            });
        }

        // 2. Comprobar si el rol del usuario está en la lista de permitidos
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ 
                status: 'error', 
                message: `Acceso denegado. El rol [${req.user.rol}] no tiene permisos para esta acción.` 
            });
        }

        // 3. Si todo está bien, permitimos que continúe al controlador
        next();
    };
};

module.exports = autorizarRoles;