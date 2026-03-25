// Verifica si el usuario tiene el rol necesario
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ msg: "No autorizado" });
        }
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ msg: "No tienes permisos para esta acción" });
        }
        next();
    };
};

module.exports = checkRole;