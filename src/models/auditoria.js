const mongoose = require('mongoose');

const AuditoriaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    accion: {
        type: String, // Ejemplo: 'CREAR_VENTA', 'ACTUALIZAR_STOCK', 'LOGIN'
        required: true
    },
    modulo: {
        type: String, // Ejemplo: 'VENTAS', 'INVENTARIO', 'AUTH'
        required: true
    },
    detalles: {
        type: String // Un resumen de lo que pasó
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Auditoria', AuditoriaSchema);