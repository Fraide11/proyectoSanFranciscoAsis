const express = require('express');
const router = express.Router();
const { crearRepuesto, obtenerInventario, actualizarRepuesto } = require('../controllers/inventarioController');

// Ruta para ver y buscar (ej: /api/repuestos?query=corolla)
router.get('/', obtenerInventario);

// Ruta para crear
router.post('/', crearRepuesto);

// Ruta para actualizar por ID
router.put('/:id', actualizarRepuesto);

module.exports = router;