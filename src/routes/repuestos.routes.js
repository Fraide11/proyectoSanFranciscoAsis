const express = require('express');
const router = express.Router();

// Una sola línea para importar todo lo que necesitas
const { 
    crearRepuesto, 
    obtenerInventario, 
    actualizarRepuesto 
} = require('../controllers/inventarioController');

// Definir las rutas
router.post('/', crearRepuesto);
router.get('/', obtenerInventario);
router.put('/:id', actualizarRepuesto);

module.exports = router;