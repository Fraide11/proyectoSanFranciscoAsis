const express = require('express');
const path = require('path'); // Módulo nativo para manejar rutas
const router = express.Router();

// --- IMPORTACIÓN DINÁMICA DE CONTROLADORES ---
// Usamos path.join para evitar errores de "Module Not Found"
const repuestoController = require(path.join(__dirname, '..', 'controllers', 'repuestoController'));

const { 
    getRepuestos, 
    createRepuesto, 
    deleteRepuesto, 
    updateRepuesto 
} = repuestoController;

// --- IMPORTACIÓN DINÁMICA DE MIDDLEWARES ---
const auth = require(path.join(__dirname, '..', 'middleware', 'authMiddleware'));
const { proteger, autorizar } = auth;

// ==========================================
//                RUTAS
// ==========================================

// RUTAS PÚBLICAS
router.get('/', getRepuestos);

// RUTAS PRIVADAS (Protegidas por Token y Rol)
// Nota: 'proteger' siempre debe ir antes que 'autorizar'
router.post('/', proteger, autorizar('admin', 'vendedor'), createRepuesto);
router.put('/:id', proteger, autorizar('admin', 'vendedor'), updateRepuesto);
router.delete('/:id', proteger, autorizar('admin'), deleteRepuesto);

module.exports = router;