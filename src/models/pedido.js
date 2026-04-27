const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    nroOrden: { 
        type: String, 
        unique: true, 
        required: true,
        // ✅ Agregamos un default por si el frontend no lo envía, 
        // así no falla el 'required'
        default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    },
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        default: null // ✅ Permite compras sin estar logueado
    },
    cliente: {
        nombre: { type: String, default: "Invitado" },
        cedula: { type: String, default: "N/A" },
        email: { type: String, default: "sin@correo.com" },
        telefono: { type: String, default: "N/A" },
        direccion: { type: String, default: "No especificada" },
        puntoReferencia: { type: String, default: "N/A" }
    },
    items: [{
        repuesto: { type: mongoose.Schema.Types.ObjectId, ref: 'Repuesto' },
        nombre: String,
        cantidad: Number,
        precioUnitario: Number
    }],
    total: { type: Number, required: true }, // Coincide con totalUSD del frontend
    tasaCambio: { type: Number, required: true },
    // ⚠️ OJO AQUÍ: Si el frontend NO envía totalBS calculado, 
    // cámbialo a 'required: false' para que no rebote el pedido.
    totalBS: { type: Number, required: false }, 
    pago: {
        referencia: String,
        bancoOrigen: String
    },
    pago: {
    metodo: { type: String },
    referencia: { type: String, default: null } // Sin el 'unique'
},
    metodoPago: { type: String, default: "Pago Móvil" }, // Campo extra para claridad
    estado: { 
        type: String, 
        enum: ['Pendiente', 'Pagado', 'Entregado', 'Cancelado'],
        default: 'Pendiente' 
    }
}, { 
    timestamps: true,
    collection: "pedidos"
});

const Pedido = mongoose.model('Pedido', PedidoSchema);
module.exports = Pedido;