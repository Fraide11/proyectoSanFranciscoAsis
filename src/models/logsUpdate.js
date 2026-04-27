const mongoose = require('mongoose');

const logsUpdateSchema = new mongoose.Schema({
    repuestoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Repuesto', 
        required: true 
    },
    usuarioId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    accion: { 
        type: String, 
        required: true, 
        default: 'EDICIÓN' 
    },
    // Ahora 'cambios' es un array de objetos para auditoría detallada
    cambios: [{
        campo: { type: String, required: true },
        valorAnterior: { type: mongoose.Schema.Types.Mixed }, // Mixed permite guardar números o strings
        valorNuevo: { type: mongoose.Schema.Types.Mixed }
    }],
    fecha: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('LogUpdate', logsUpdateSchema);