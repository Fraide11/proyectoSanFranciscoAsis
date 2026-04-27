const mongoose = require('mongoose');

const configuracionSchema = new mongoose.Schema({
    tasaDolarBCV: { 
        type: Number, 
        required: true, 
        default: 36.5 
    },
    ultimaActualizacion: { 
        type: Date, 
        default: Date.now 
    },
    actualizadoPor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuario' 
    },
    nombreTienda: { 
        type: String, 
        default: "Automotriz San Francisco de Asís" 
    }
}, { timestamps: true });

module.exports = mongoose.model('Configuracion', configuracionSchema, 'configuracion');