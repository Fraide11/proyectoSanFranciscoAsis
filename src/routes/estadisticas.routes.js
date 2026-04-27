const express = require('express');
const router = express.Router();
// Importamos específicamente la función que definimos arriba
const { obtenerVentasPorDia } = require('../controllers/estadisticasController');

// Verificación en consola para tu tranquilidad
console.log("Ruta cargada - Función estadística:", obtenerVentasPorDia);

router.get('/ventas-dia', obtenerVentasPorDia);

module.exports = router;