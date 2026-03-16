const Repuesto = require('../models/repuesto');
const Venta = require('../models/venta');

// @desc    Obtener repuestos con stock bajo el mínimo
// @route   GET /api/reportes/stock-bajo
const obtenerStockBajo = async (req, res) => {
    try {
        // Buscamos repuestos donde el stock sea menor o igual al stockMinimo
        const repuestosCriticos = await Repuesto.find({
            $expr: { $lte: ["$stock", "$stockMinimo"] }
        });

        res.status(200).json({
            status: 'success',
            count: repuestosCriticos.length,
            data: repuestosCriticos
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Resumen de ventas diarias
// @route   GET /api/reportes/ventas-hoy
const obtenerVentasHoy = async (req, res) => {
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Inicio del día

        const ventas = await Venta.find({
            fecha: { $gte: hoy }
        }).populate('vendedor', 'nombre'); // Para saber quién vendió qué

        const totalDinero = ventas.reduce((acc, venta) => acc + venta.total, 0);

        res.status(200).json({
            status: 'success',
            totalVentas: ventas.length,
            montoTotal: totalDinero,
            ventas
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    obtenerStockBajo,
    obtenerVentasHoy
};