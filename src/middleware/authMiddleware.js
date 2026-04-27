const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// 1. VERIFICAR TOKEN (PROTEGER)
const proteger = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'secret_san_francisco_2026');
            
            const userId = decodificado.id || (decodificado.user ? decodificado.user.id : null);
            if (!userId) return res.status(401).json({ msg: 'Token inválido' });

            const usuarioEncontrado = await Usuario.findById(userId).select('-password');
            if (!usuarioEncontrado) return res.status(401).json({ msg: 'El usuario no existe' });

            req.user = usuarioEncontrado;
            return next(); 
        } catch (error) {
            return res.status(401).json({ msg: 'Sesión expirada' });
        }
    }

    if (!token) return res.status(401).json({ msg: 'No hay token, acceso denegado' });
};

// 2. CONTROL DE ROLES (AUTORIZAR)
const autorizar = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.rol)) {
            return res.status(403).json({ msg: 'No tienes permisos para esta acción' });
        }
        return next();
    };
};

// EXPORTACIÓN LIMPIA
module.exports = { proteger, autorizar };