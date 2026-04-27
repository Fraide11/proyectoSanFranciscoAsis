const Venta = require('../models/venta');
const Repuesto = require('../models/repuesto');
const { registrarLog } = require('./auditoriaController');
const { generarFacturaPDF } = require('../services/pdfServices');

// @desc    Registrar una nueva venta y descontar stock
const registrarVenta = async (req, res) => {
    try {
        const { cliente, items, total, metodoPago } = req.body; 
        
        const usuarioAccionId = req.user ? req.user.id : req.body.vendedorId; 

        // 1. Validar stock
        for (const item of items) {
            const repuesto = await Repuesto.findById(item.repuestoId);
            if (!repuesto) {
                return res.status(404).json({ message: `Repuesto no encontrado: ${item.repuestoId}` });
            }
            if (repuesto.stock < item.cantidad) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para: ${repuesto.nombre}. Disponible: ${repuesto.stock}` 
                });
            }
        }

        // 2. Crear la venta
        const nuevaVenta = new Venta({
            vendedor: (req.user?.rol === 'trabajador' || req.user?.rol === 'admin') ? req.user.id : null,
            cliente: {
                usuarioId: req.user?.rol === 'cliente' ? req.user.id : null,
                nombre: cliente.nombre,
                telefono: cliente.telefono,
                cedulaRif: cliente.cedula 
            },
            items: items.map(item => ({
                repuestoId: item.repuestoId,
                nombreCapturado: item.nombre, 
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                subtotal: item.cantidad * item.precioUnitario
            })),
            total,
            metodoPago,
            estado: 'Completada',
            fecha: new Date()
        });

        await nuevaVenta.save();

        // 3. Restar stock
        for (const item of items) {
            await Repuesto.findByIdAndUpdate(item.repuestoId, {
                $inc: { stock: -item.cantidad } 
            });
        }

        // 4. Auditoría
        await registrarLog(
            usuarioAccionId,
            'CREAR_VENTA',
            'VENTAS',
            `Venta registrada - Total: ${total}. Cliente: ${cliente.nombre}`
        );

        // 5. PDF
        try {
            const pdfPath = await generarFacturaPDF(nuevaVenta);
            return res.status(201).json({ 
                status: 'success', 
                message: 'Venta realizada con éxito', 
                venta: nuevaVenta,
                pdf: pdfPath 
            });
        } catch (pdfError) {
            return res.status(201).json({ 
                status: 'success', 
                message: 'Venta realizada, error en PDF', 
                venta: nuevaVenta 
            });
        }

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Obtener estadísticas de ventas agrupadas por día
const obtenerEstadisticasVentas = async (req, res) => {
    try {
        const stats = await Venta.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
                    totalVenta: { $sum: "$total" },
                    cantidadOperaciones: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        res.json(stats); 
    } catch (error) {
        res.status(500).json({ msg: "Error al agrupar ventas", detalle: error.message });
    }
};

// @desc    Generar y descargar factura
const exportarFactura = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id);
        if (!venta) return res.status(404).json({ mensaje: "Venta no encontrada" });

        const filePath = await generarFacturaPDF(venta);
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al exportar factura", error: error.message });
    }
};

// EXPORTACIÓN ÚNICA Y LIMPIA
module.exports = { 
    registrarVenta, 
    exportarFactura,
    obtenerEstadisticasVentas
};