const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Tu validación de JWT/Passport
const checkRole = require('../middleware/roleMiddleware');
const authController = require('../controllers/authController');
const { obtenerStockBajo, obtenerVentasHoy } = require('../controllers/reportesController');

// Solo el admin puede registrar trabajadores
router.post('/register-worker', 
    authMiddleware, 
    checkRole(['admin']), 
    authController.registerWorker // Crea una función similar a register pero forzando rol 'trabajador'
);

// Solo el admin puede eliminar trabajadores
router.delete('/worker/:id', 
    authMiddleware, 
    checkRole(['admin']), 
    authController.deleteWorker 
);

// Solo los administradores deberían poder ver esto
router.get('/stock-bajo', obtenerStockBajo);
router.get('/ventas-hoy', obtenerVentasHoy);

module.exports = router;