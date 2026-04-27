const express = require('express');
const router = express.Router();
const logsUpdateController = require('../controllers/logsUpdateController');

// Middlewares (Importación según lo que me explicaste)
const { proteger } = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

// Validamos que las funciones existan antes de pasarlas al router
// Si alguna es undefined, el console.log te dirá cuál es la que falta
console.log('Cargando funciones del controlador:', {
    completo: typeof logsUpdateController.obtenerHistorialCompleto,
    porRepuesto: typeof logsUpdateController.obtenerLogsPorRepuesto
});

// Rutas
router.get('/', proteger, autorizarRoles('admin'), logsUpdateController.obtenerHistorialCompleto);
router.get('/repuesto/:id', proteger, logsUpdateController.obtenerHistorialCompleto);

module.exports = router;