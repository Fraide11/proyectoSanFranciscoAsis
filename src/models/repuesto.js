const mongoose = require('mongoose');

const RepuestoSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El código o SKU es obligatorio'],
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: [true, 'Nombre del repuesto (ej: Bomba de Agua)']
    },
    descripcion: {
        type: String
    },
    marcaCarro: {
        type: String,
        required: [true, 'Marca del vehículo (ej: Toyota)']
    },
    modeloCarro: {
        type: String,
        required: [true, 'Modelo del vehículo (ej: Corolla)']
    },
    anioCompatibilidad: {
        desde: Number,
        hasta: Number
    },
    precioVenta: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    costoCompra: {
        type: Number // Esto solo lo verá el Admin
    },
    stock: {
        type: Number,
        default: 0
    },
    stockMinimo: {
        type: Number,
        default: 2 // Alerta cuando queden pocos
    },
    ubicacionPasillo: {
        type: String // Para saber en qué estante está
    },
    // Campo actualizado para recibir la URL de ImgBB
    imagenUrl: {
        type: String,
        default: 'https://via.placeholder.com/150?text=Sin+Imagen' 
    }
}, { timestamps: true }); // Agregado para saber cuándo se creó/actualizó cada pieza

module.exports = mongoose.model('Repuesto', RepuestoSchema);