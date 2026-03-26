const express = require('express');
const router = express.Router();

// Middlewares de Seguridad
const { proteger } = require('../middleware/authMiddleware'); 
const autorizarRoles = require('../middleware/roleMiddleware');

// Controladores
const authController = require('../controllers/authController');
const { obtenerStockBajo, obtenerVentasHoy } = require('../controllers/reportesController');

/**
 * 🛡️ RUTAS PROTEGIDAS - NIVEL: ADMINISTRADOR
 * Todas estas rutas requieren Token válido y Rol 'admin'
 */

// 1. Gestión de Personal (Solo Admin)
router.post('/register-worker', 
    proteger, 
    autorizarRoles('admin'), 
    authController.registerWorker 
);

router.delete('/worker/:id', 
    proteger, 
    autorizarRoles('admin'), 
    authController.deleteWorker 
);

// 2. Reportes Críticos (Solo Admin)
// Agregamos la protección que faltaba para que no sean públicas
router.get('/stock-bajo', 
    proteger, 
    autorizarRoles('admin'), 
    obtenerStockBajo
);

router.get('/ventas-hoy', 
    proteger, 
    autorizarRoles('admin'), 
    obtenerVentasHoy
);

module.exports = router;