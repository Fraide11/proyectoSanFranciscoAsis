const mongoose = require('mongoose');

const RepuestoSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El código o SKU es obligatorio'],
        unique: true, 
        trim: true,
        uppercase: true 
    },
    nombre: {
        type: String,
        default: 'Nuevo Repuesto',
        trim: true
    },
    descripcion: {
        type: String,
        trim: true,
        default: ''
    },
    categoria: {
        type: String,
        default: 'Otros'
    },
    marcaCarro: {
        type: String,
        default: 'Universal',
        trim: true
    },
    modeloCarro: {
        type: String,
        default: 'N/A',
        trim: true
    },
    anioCompatibilidad: {
        desde: { type: Number, default: 2000 },
        hasta: { type: Number, default: new Date().getFullYear() }
    },
    precioVenta: {
        type: Number,
        default: 0,
        min: [0, 'El precio no puede ser negativo']
    },
    costoCompra: {
        type: Number,
        default: 0,
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
        trim: true,
        default: 'Almacén'
    },
    imagenUrl: {
        type: String,
        default: 'https://via.placeholder.com/150?text=Sin+Imagen' 
    }
}, { 
    timestamps: true 
});

/**
 * MIDDLEWARE PRE-SAVE
 * CORRECCIÓN: Se elimina el argumento 'next'. 
 * En versiones actuales de Mongoose, si la función es síncrona, no se debe llamar a next().
 */
RepuestoSchema.pre('save', function() {
    if (this.precioVenta <= this.costoCompra) {
        console.warn(`[!] Alerta en ${this.codigo}: Precio de venta ($${this.precioVenta}) no deja margen de ganancia.`);
    }
    // Ya no hay llamada a next(), Mongoose continúa automáticamente al terminar la función.
});

//module.exports = mongoose.model('Repuesto', RepuestoSchema, 'repuestos');
// Busca si el modelo ya existe en la instancia de mongoose, de lo contrario lo crea
module.exports = mongoose.models.Repuesto || mongoose.model('Repuesto', RepuestoSchema, 'repuestos');