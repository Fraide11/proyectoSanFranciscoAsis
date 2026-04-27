const express = require('express');
const router = express.Router();

// --- IMPORTACIÓN DE CONTROLADORES ---
const repuestoController = require('../controllers/repuestoController');

// --- IMPORTACIÓN DE MIDDLEWARES ---
// Asegúrate de que la ruta '../middleware/authMiddleware' sea la correcta
const auth = require('../middleware/authMiddleware');

// ==========================================
//                RUTAS DE INVENTARIO
// ==========================================

/**
 * @route   GET /api/repuestos
 * @desc    Obtener lista de repuestos (Público)
 */
router.get('/', repuestoController.getRepuestos);

/**
 * @route   POST /api/repuestos
 * @desc    Registrar nuevo repuesto (Admin y Vendedor)
 */
router.post('/', 
    auth.proteger, 
    auth.autorizar('admin', 'trabajador'), 
    repuestoController.createRepuesto
);

/**
 * @route   PUT /api/repuestos/:id
 * @desc    Actualizar datos de un repuesto (Admin y Vendedor)
 */
router.put('/:id', 
    auth.proteger, 
    auth.autorizar('admin', 'trabajador'), 
    repuestoController.updateRepuesto
);

/**
 * @route   DELETE /api/repuestos/:id
 * @desc    Eliminar un repuesto del sistema (Solo Admin)
 */
router.delete('/:id', 
    auth.proteger, 
    auth.autorizar('admin'), 
    repuestoController.deleteRepuesto
);

module.exports = router;