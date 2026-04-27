const mongoose = require('mongoose');

const TasaSchema = new mongoose.Schema({
    valor: {
        type: Number,
        required: [true, 'El valor de la tasa es obligatorio'],
        default: 0
    },
    moneda: {
        type: String,
        default: 'USD'
    },
    fuente: {
        type: String,
        default: 'BCV (Internet)', // Coincide con la lógica del controlador
        enum: ['BCV (Internet)', 'Manual', 'Paralelo']
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    collection: 'tasa' // Nombre de la colección en singular como pediste
});

// Índice para asegurar que la búsqueda por fecha sea rápida
TasaSchema.index({ fechaActualizacion: -1 });

module.exports = mongoose.model('Tasa', TasaSchema);