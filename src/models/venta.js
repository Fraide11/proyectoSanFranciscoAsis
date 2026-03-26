const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    // Número de factura único (ej: FAC-0001)
    nroControl: {
        type: String,
        unique: true,
        required: true,
        default: () => `FAC-${Date.now().toString().slice(-6)}` // Generador básico
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    cliente: {
        nombre: { type: String, default: 'Consumidor Final', trim: true },
        cedulaRif: { type: String, trim: true }
    },
    items: [{
        repuestoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Repuesto',
            required: true
        },
        nombreCapturado: { type: String, required: true }, 
        cantidad: {
            type: Number,
            required: true,
            min: [1, 'La cantidad mínima es 1']
        },
        precioUnitario: {
            type: Number,
            required: true
        },
        subtotal: { // Calculado automáticamente para reportes rápidos
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    metodoPago: {
        type: String,
        enum: ['Efectivo', 'Transferencia', 'Pago Móvil', 'Divisas', 'Punto de Venta'],
        default: 'Efectivo'
    },
    estado: {
        type: String,
        enum: ['Completada', 'Anulada'],
        default: 'Completada'
    },
    fecha: {
        type: Date,
        default: Date.now,
        index: true // Optimiza reportes por rango de fechas
    }
}, {
    timestamps: true, // Nos da createdAt y updatedAt automáticamente
    versionKey: false
});

// Índice para búsquedas rápidas por cliente
VentaSchema.index({ "cliente.cedulaRif": 1 });

module.exports = mongoose.model('Venta', VentaSchema);