const Repuesto = require('../models/repuesto');
const Venta = require('../models/venta');
const { generarDocumentoPDF } = require('../services/pdfServices');

// @desc    Obtener repuestos con stock bajo el mínimo
// @route   GET /api/reportes/stock-bajo
const obtenerStockBajo = async (req, res) => {
    console.log("--> [BACKEND] Petición recibida en obtenerStockBajo");
    console.log("--> [BACKEND] Query params:", req.query);

    try {
        const repuestosCriticos = await Repuesto.find({
            $expr: { $lte: ["$stock", "$stockMinimo"] }
        }).lean();

        console.log(`--> [BACKEND] Repuestos encontrados con stock bajo: ${repuestosCriticos.length}`);

        if (req.query.download === 'pdf') {
            console.log("--> [BACKEND] Iniciando generación de PDF...");
            const pathPDF = await generarDocumentoPDF({ data: repuestosCriticos }, 'REPORTE');
            
            console.log("--> [BACKEND] PDF generado con éxito en:", pathPDF);
            return res.download(pathPDF);
        }

        res.status(200).json({ status: 'success', data: repuestosCriticos });
    } catch (error) {
        console.error("❌ [BACKEND] Error en controlador:", error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Resumen de ventas diarias (Cierre de Caja)
// @route   GET /api/reportes/ventas-hoy
const obtenerVentasHoy = async (req, res) => {
    try {
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);

        const finDia = new Date();
        finDia.setHours(23, 59, 59, 999);

        const ventas = await Venta.find({
            fecha: { $gte: inicioDia, $lte: finDia },
            estado: 'Completada' // Solo sumamos ventas reales, no anuladas
        })
        .populate('vendedor', 'nombre')
        .lean();

        // Cálculo optimizado del monto total
        const montoTotal = ventas.reduce((acc, venta) => acc + (venta.total || 0), 0);

        res.status(200).json({
            status: 'success',
            fecha: inicioDia.toLocaleDateString(),
            totalOperaciones: ventas.length,
            montoTotal: montoTotal.toFixed(2), // Formato moneda
            ventas
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: "Error al calcular el cierre de ventas" });
    }
};




// @desc    Reporte de Inventario Completo (Stock Actual)
// @route   GET /api/reportes/inventario-completo
// Reporte de Inventario Completo (Stock Actual)
const obtenerInventarioCompleto = async (req, res) => {
    try {
        // Traemos TODO el inventario, ordenado por nombre
        const inventario = await Repuesto.find({}).sort({ nombre: 1 }).lean();

        if (req.query.download === 'pdf') {
            // Llamamos al servicio con el nuevo tipo
            const pathPDF = await generarDocumentoPDF({ data: inventario }, 'INVENTARIO_TOTAL');
            
            return res.download(pathPDF, () => {
                const fs = require('fs');
                if (fs.existsSync(pathPDF)) fs.unlinkSync(pathPDF); // Mantenemos limpio el servidor
            });
        }

        res.status(200).json({ status: 'success', data: inventario });
    } catch (error) {
        console.error("Error en inventario completo:", error);
        res.status(500).json({ status: 'error', message: "Error al generar el inventario" });
    }
};


module.exports = {
    obtenerStockBajo,
    obtenerVentasHoy,
    obtenerInventarioCompleto
};