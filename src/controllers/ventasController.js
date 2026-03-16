const Venta = require('../models/venta');
const Repuesto = require('../models/repuesto');
const { registrarLog } = require('./auditoriaController');
const { generarFacturaPDF } = require('../services/pdfServices');

// @desc    Registrar una nueva venta y actualizar stock
// @route   POST /api/ventas
const registrarVenta = async (req, res) => {
    try {
        const { cliente, items, total, metodoPago } = req.body; 
        const vendedorId = req.user ? req.user._id : req.body.vendedorId; 

        // 1. Validar stock para cada repuesto antes de procesar
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

        // 2. Si todo está bien, crear la venta
        const nuevaVenta = new Venta({
            vendedor: vendedorId,
            cliente,
            items,
            total,
            metodoPago,
            fecha: new Date()
        });

        await nuevaVenta.save();

        // 3. Restar el stock en la base de datos
        for (const item of items) {
            await Repuesto.findByIdAndUpdate(item.repuestoId, {
                $inc: { stock: -item.cantidad } 
            });
        }

        // 4. REGISTRO EN AUDITORÍA
        await registrarLog(
            vendedorId,
            'CREAR_VENTA',
            'VENTAS',
            `Venta # ${nuevaVenta._id} procesada. Total: ${total}. Cliente: ${cliente.nombre || 'N/A'}`
        );

        // 5. GENERACIÓN DE FACTURA PDF
        try {
            const pdfPath = await generarFacturaPDF(nuevaVenta);
            console.log('Factura generada en:', pdfPath);
            
            return res.status(201).json({ 
                status: 'success', 
                message: 'Venta realizada y factura generada', 
                venta: nuevaVenta,
                pdf: pdfPath 
            });
        } catch (pdfError) {
            console.error('Error al generar PDF:', pdfError);
            return res.status(201).json({ 
                status: 'success', 
                message: 'Venta realizada, pero hubo un error con el PDF', 
                venta: nuevaVenta 
            });
        }

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = { registrarVenta };