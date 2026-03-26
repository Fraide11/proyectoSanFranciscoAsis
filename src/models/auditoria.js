const mongoose = require('mongoose');

const AuditoriaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Asegúrate de que tu modelo de login se llame 'Usuario'
        required: true
    },
    accion: {
        type: String, 
        required: true,
        uppercase: true, // Siempre se guarda en MAYÚSCULAS para facilitar búsquedas
        trim: true
    },
    modulo: {
        type: String, 
        required: true,
        uppercase: true,
        trim: true
    },
    detalles: {
        type: mongoose.Schema.Types.Mixed, // Permite guardar Strings u Objetos JSON
        required: true
    },
    ipAddress: { 
        type: String // Extra para seguridad: saber desde qué red se hizo el cambio
    },
    fecha: {
        type: Date,
        default: Date.now,
        index: true // Añadimos un índice para que las búsquedas por fecha sean ultra rápidas
    }
}, {
    timestamps: false, // No necesitamos updatedAt porque un log es inmutable (no se edita)
    versionKey: false
});

// Índice compuesto para auditorías rápidas por usuario y módulo
AuditoriaSchema.index({ usuario: 1, modulo: 1 });

module.exports = mongoose.model('Auditoria', AuditoriaSchema);