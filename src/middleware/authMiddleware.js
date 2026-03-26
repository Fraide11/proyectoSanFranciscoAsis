const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// 1. Verificar si el usuario está logueado y el token es válido
exports.proteger = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraer el token del string "Bearer [TOKEN]"
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'secret_san_francisco_2026');
            
            // Buscamos al usuario en la DB para confirmar que sigue existiendo y está activo
            const usuarioEncontrado = await Usuario.findById(decodificado.user.id).select('-password');

            if (!usuarioEncontrado) {
                return res.status(401).json({ msg: 'El usuario ya no existe en el sistema' });
            }

            if (!usuarioEncontrado.activo) {
                return res.status(401).json({ msg: 'Tu cuenta ha sido desactivada. Contacta al administrador' });
            }

            // Inyectamos el usuario completo en el objeto req para usarlo en los controladores
            req.user = usuarioEncontrado;
            next();

        } catch (error) {
            console.error('Error en validación de token:', error.message);
            return res.status(401).json({ msg: 'Token no válido o expirado' });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: 'Acceso denegado, no se proporcionó un token' });
    }
};

// 2. Control de acceso por Roles (RBAC)
exports.autorizar = (...roles) => {
    return (req, res, next) => {
        // req.user viene del middleware 'proteger', por eso siempre deben ir juntos
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ 
                msg: `Permiso denegado: El rol [${req.user.rol}] no está autorizado para esta acción` 
            });
        }
        next();
    };
};