const express = require('express');
const router = express.Router();
const tasaController = require('../controllers/tasaController');

// Ruta pública para que la app calcule precios
// Usando tus nombres: getTasa y updateTasa
router.get('/', tasaController.getTasa);
router.put('/update', tasaController.updateTasa); // Aquí antes decía updateTasaManual y por eso fallaba

module.exports = router;