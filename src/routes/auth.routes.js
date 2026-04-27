const express = require('express');
const router = express.Router();

// 1. Agregamos updateUserProfile a la lista de importaciones
const { 
    login, 
    register,
    registerWorker, 
    deleteWorker,
    forgotPassword,
    resetPassword,
    updateUserProfile // <--- ¡No olvides esta!
} = require('../controllers/authController');

// 2. Aquí lo importas como "proteger"
const { proteger } = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

/**
 * 🔑 RUTAS DE PERFIL Y SEGURIDAD
 */

// 3. Cambiamos 'protect' por 'proteger' para que coincida con tu importación
router.put('/profile', proteger, updateUserProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

/**
 * 🔑 RUTAS DE AUTENTICACIÓN Y USUARIOS
 */

// Login (Público)
router.post('/login', login);
router.post('/register', register);

// Registro de Trabajadores (Solo Admin)
router.post('/register-worker', 
    proteger, 
    autorizarRoles('admin'), 
    registerWorker
);

// Eliminar Trabajador (Solo Admin)
router.delete('/worker/:id', 
    proteger, 
    autorizarRoles('admin'), 
    deleteWorker
);

module.exports = router;