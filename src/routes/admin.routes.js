const express = require('express');
const router = express.Router();

// Middlewares de Seguridad
const { proteger, autorizar } = require('../middleware/authMiddleware.js');
const autorizarRoles = require('../middleware/roleMiddleware');

// Controladores
const authController = require('../controllers/authController');
// 1. Asegúrate de que las importaciones usen los nombres reales de tus controladores
const { obtenerStockBajo, obtenerVentasHoy,obtenerInventarioCompleto } = require('../controllers/reportesController');

// ... otros middlewares y controladores ...

// 2. Corrige la ruta. 
// NUNCA pongas "?" en el router.get. Express no maneja query params ahí.
// Usa el nombre de la función que SÍ existe en tu controlador: obtenerStockBajo
router.get('/stock-bajo', proteger, autorizarRoles('admin'), obtenerStockBajo);

router.get('/ventas-hoy', proteger, autorizarRoles('admin'), obtenerVentasHoy);// 1. Gestión de Personal (Solo Admin)
// Agrega esta línea junto a la de stock-bajo
router.get('/inventario-completo', proteger, autorizarRoles('admin'), obtenerInventarioCompleto);



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

// El prefijo /api/reportes ya suele venir del app.js principal, 
// así que aquí solo pones la sub-ruta:
router.get('/stock-bajo', proteger, autorizarRoles('admin'), obtenerStockBajo);

router.get('/reportes/ventas-hoy', proteger, autorizarRoles('admin'), obtenerVentasHoy);

module.exports = router;