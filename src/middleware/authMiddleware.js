const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// Middleware para verificar que el usuario está logueado
exports.proteger = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'secret_para_desarrollo_123');
            
            // Buscamos al usuario y lo metemos en la petición (req.user)
            req.user = await Usuario.findById(decodificado.user.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ msg: 'No autorizado, token fallido' });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    }
};

// Middleware para permitir acceso SOLO a roles específicos (Admin o Vendedor)
exports.autorizar = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ 
                msg: `El rol [${req.user.rol}] no tiene permiso para acceder a esta ruta` 
            });
        }
        next();
    };
};