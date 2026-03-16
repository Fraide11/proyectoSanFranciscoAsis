const express = require('express');
const router = express.Router();
const { obtenerStockBajo, obtenerVentasHoy } = require('../controllers/reportesController');

// Solo los administradores deberían poder ver esto
router.get('/stock-bajo', obtenerStockBajo);
router.get('/ventas-hoy', obtenerVentasHoy);

module.exports = router;