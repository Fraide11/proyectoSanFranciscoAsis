const express = require('express');
const router = express.Router();
const { 
    getRepuestos, 
    createRepuesto, 
    deleteRepuesto, 
    updateRepuesto // ¡No olvides importarlo del controlador!
} = require('../controllers/repuestoController');
const { proteger, autorizar } = require('../middlewares/authMiddleware');

// RUTAS PÚBLICAS
router.get('/', getRepuestos);

// RUTAS PRIVADAS (Protegidas por Token y Rol)
router.post('/', proteger, autorizar('admin', 'vendedor'), createRepuesto);
router.put('/:id', proteger, autorizar('admin', 'vendedor'), updateRepuesto);
router.delete('/:id', proteger, autorizar('admin'), deleteRepuesto);

module.exports = router;