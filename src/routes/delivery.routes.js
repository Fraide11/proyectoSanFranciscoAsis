const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// --- RUTAS DE GESTIÓN (ADMIN/WORKER) ---

// Obtener todos los envíos (Para el AdminPanel - Img 1)
router.get('/todos', deliveryController.obtenerDeliveries);


// Asignar un trabajador a un delivery específico
router.put('/asignar/:id', deliveryController.asignarRepartidor);

// Actualizar el estado del envío (Pendiente -> En Camino -> Entregado)
router.put('/actualizar-estado/:id', deliveryController.actualizarEstado);

// Actualizar tiempo estimado y coordenadas de ruta
router.put('/logistica/:id', deliveryController.actualizarTiempoYRuta);


// --- RUTAS DE CLIENTE / AUTOMATIZACIÓN ---

// Crear un nuevo registro de delivery (Se dispara desde el Checkout - Img 2)
router.post('/crear', deliveryController.crearDelivery);

// (Opcional) Obtener el estado de un delivery específico para el cliente
// router.get('/rastreo/:pedidoId', deliveryController.obtenerDeliveryPorPedido);

module.exports = router;
