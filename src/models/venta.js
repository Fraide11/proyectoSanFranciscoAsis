const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    // Referencia al usuario (vendedor) que realizó la operación
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    cliente: {
        nombre: { type: String, default: 'Consumidor Final' },
        cedulaRif: { type: String }
    },
    // Array de productos vendidos
    items: [{
        repuestoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repuesto',
            required: true
        },
        nombreCapturado: String, // Guardamos el nombre por si el repuesto se borra luego
        cantidad: {
            type: Number,
            required: true,
            min: 1
        },
        precioUnitario: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    metodoPago: {
        type: String,
        enum: ['Efectivo', 'Transferencia', 'Pago Móvil', 'Divisas'],
        default: 'Efectivo'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Venta', VentaSchema);