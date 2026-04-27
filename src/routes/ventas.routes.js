const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

// Cambiamos a 'proteger' y verificamos la ruta del archivo (middleware sin 's')
const { proteger } = require('../middleware/authMiddleware'); 

// --- RUTAS DE CONSULTA Y ESTADÍSTICAS ---

// Ahora la ruta usa 'proteger' correctamente
router.get('/estadisticas', proteger, ventasController.obtenerEstadisticasVentas);

router.get('/', (req, res) => {
    res.json({ mensaje: "Ruta de ventas funcionando" });
});

// --- RUTAS DE DOCUMENTOS (PDF) ---

// Aplicamos 'proteger' también aquí para mantener la seguridad
router.get('/descargar/:id', proteger, ventasController.exportarFactura);

router.get('/factura/:id', proteger, async (req, res) => {
    try {
        const Venta = require('../models/venta');
        const { generarDocumentoPDF } = require('../services/pdfServices');
        
        const venta = await Venta.findById(req.params.id);
        if (!venta) return res.status(404).send('Venta no encontrada');
        
        const pathPDF = await generarDocumentoPDF(venta, 'FACTURA');
        res.download(pathPDF);
    } catch (error) {
        res.status(500).send('Error generando factura');
    }
});

// --- RUTAS DE ACCIÓN ---

// Registro de venta protegido
router.post('/', proteger, ventasController.registrarVenta);

module.exports = router;