const express = require('express');
const router = express.Router();

// Controladores
const { 
    login, 
    registerWorker, 
    deleteWorker 
} = require('../controllers/authController');

// Middlewares de Seguridad
const { proteger } = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

/**
 * 🔑 RUTAS DE AUTENTICACIÓN Y USUARIOS
 */

// 1. Login (Público) - /api/auth/login
router.post('/login', login);

// 2. Registro de Trabajadores (Solo Admin) - /api/auth/register-worker
// Se requiere estar logueado y tener rol de administrador
router.post('/register-worker', 
    proteger, 
    autorizarRoles('admin'), 
    registerWorker
);

// 3. Eliminar Trabajador (Solo Admin) - /api/auth/worker/:id
router.delete('/worker/:id', 
    proteger, 
    autorizarRoles('admin'), 
    deleteWorker
);

module.exports = router;