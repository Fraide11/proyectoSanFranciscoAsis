const express = require('express');
const router = express.Router();
const { getRepuestos, createRepuesto, deleteRepuesto } = require('../controllers/repuestoController');
const { proteger, autorizar } = require('../middlewares/authMiddleware');

// RUTAS PÚBLICAS (Lo que ve el Cliente en tu mockup)
// Cualquier persona puede ver los repuestos para comprar
router.get('/', getRepuestos);

// RUTAS PRIVADAS (Lo que hace el Admin/Vendedor en tu Panel)
// Solo logueados que sean 'admin' o 'vendedor' pueden crear o borrar
router.post('/', proteger, autorizar('admin', 'vendedor'), createRepuesto);
router.delete('/:id', proteger, autorizar('admin'), deleteRepuesto);

module.exports = router;