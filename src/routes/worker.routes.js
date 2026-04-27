const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { proteger } = require('../middleware/authMiddleware');

// El trabajador usa la MISMA función del admin para ver, pero su propia ruta
router.get('/inventario', proteger, inventarioController.obtenerInventario);

// Para actualizar stock (solo el campo stock)
router.put('/stock/:id', proteger, inventarioController.actualizarRepuesto);

module.exports = router;