const express = require('express');
const router = express.Router();
const { registrarVenta } = require('../controllers/ventasController');

// Aquí podrías importar tu middleware de autenticación luego
// const { protect } = require('../middleware/authMiddleware');


router.get('/', (req, res) => {
    res.json({ mensaje: "Ruta de ventas funcionando" });
});

module.exports = router;