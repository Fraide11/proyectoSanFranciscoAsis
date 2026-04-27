const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  // Relación directa con el pedido
  pedidoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pedido', 
    required: true 
  },
  
  // Datos específicos del envío
  costoEnvio: { 
    type: Number, 
    default: 0 
  },

  // Agrupamos lo logístico para mantener orden
  logistica: {
    repartidorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario' // Asegúrate de que el modelo Usuario exista
    },
    tiempoEstimado: { type: String }, // "20 min"
    distancia: { type: String },      // "5 km"
    destinoCoords: { type: String }   // Link o coordenadas de Google Maps
  },

  estado: {
    type: String,
    enum: ['Pendiente', 'En Preparación', 'En Ruta', 'Entregado', 'Cancelado'],
    default: 'Pendiente'
  },

  // Historial para auditoría o línea de tiempo en la vista
  historial: [{
    estado: String,
    nota: String,
    fecha: { type: Date, default: Date.now }
  }],

  fechaSalida: { type: Date },
  fechaEntrega: { type: Date }

}, { 
  timestamps: true// <--- ESTO: Fuerza a Mongoose a usar el nombre en singular
});


module.exports = mongoose.model('Delivery', deliverySchema,'deliveries');