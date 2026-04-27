const express = require('express');
const router = express.Router();

// 1. Importamos los middlewares (SOLO UNA VEZ)
const { proteger, autorizar } = require('../middleware/authMiddleware');

// 2. Importamos las funciones del controlador
const { 
    crearPedido, 
    obtenerMisPedidos, 
    actualizarEstadoPedido,
    obtenerTodosLosPedidos,
    eliminarPedido 
} = require('../controllers/pedidoController');

// --- RUTAS ---

// Obtener TODOS los pedidos (Solo Admin)
router.get('/', proteger, autorizar('admin'), obtenerTodosLosPedidos);

// Crear pedido
router.post('/', crearPedido); // Probablemente quieras proteger esta también

// Ruta para que el cliente vea solo SUS compras
// Ojo: te faltaba pasarle el controlador 'obtenerMisPedidos' al final
router.get('/mis-pedidos', proteger, autorizar('cliente'), obtenerMisPedidos);

// Actualizar estado (Solo Admin)
router.put('/:id/estado', proteger, autorizar('admin'), actualizarEstadoPedido);

// Eliminar pedido
router.delete('/:id', proteger, autorizar('admin'), eliminarPedido);

module.exports = router;