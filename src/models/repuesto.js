const mongoose = require('mongoose');

const RepuestoSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El código o SKU es obligatorio'],
        unique: true, // Esto evita duplicados en San Francisco de Asís
        trim: true,
        uppercase: true // Guarda siempre en mayúsculas para consistencia
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del repuesto es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['Motor', 'Frenos', 'Suspension', 'Electricidad', 'Carroceria', 'Otros'],
        default: 'Motor'
    },
    marcaCarro: {
        type: String,
        required: [true, 'La marca del vehículo es obligatoria'],
        trim: true
    },
    modeloCarro: {
        type: String,
        required: [true, 'El modelo del vehículo es obligatorio'],
        trim: true
    },
    anioCompatibilidad: {
        desde: { type: Number, min: 1950 },
        hasta: { type: Number, max: new Date().getFullYear() + 1 }
    },
    precioVenta: {
        type: Number,
        required: [true, 'El precio de venta es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    costoCompra: {
        type: Number,
        min: [0, 'El costo no puede ser negativo']
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'El stock no puede ser negativo']
    },
    stockMinimo: {
        type: Number,
        default: 2
    },
    ubicacionPasillo: {
        type: String,
        trim: true
    },
    imagenUrl: {
        type: String,
        default: 'https://via.placeholder.com/150?text=Sin+Imagen' 
    }
}, { 
    timestamps: true // Esto crea 'createdAt' y 'updatedAt' automáticamente
});

// Middleware opcional: Validar que el precio de venta sea mayor al costo
RepuestoSchema.pre('save', function(next) {
    if (this.precioVenta <= this.costoCompra) {
        console.warn('Alerta: El precio de venta es menor o igual al costo de compra.');
    }
    next();
});

module.exports = mongoose.model('Repuesto', RepuestoSchema);