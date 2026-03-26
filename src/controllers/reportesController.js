const Repuesto = require('../models/repuesto');
const Venta = require('../models/venta');

// @desc    Obtener repuestos con stock bajo el mínimo
// @route   GET /api/reportes/stock-bajo
const obtenerStockBajo = async (req, res) => {
    try {
        // Buscamos repuestos donde el stock sea menor o igual al stockMinimo definido en el modelo
        const repuestosCriticos = await Repuesto.find({
            $expr: { $lte: ["$stock", "$stockMinimo"] }
        }).sort({ stock: 1 }).lean();

        res.status(200).json({
            status: 'success',
            count: repuestosCriticos.length,
            data: repuestosCriticos
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: "Error al generar reporte de inventario" });
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

module.exports = {
    obtenerStockBajo,
    obtenerVentasHoy
};