const mongoose = require('mongoose');

// backend/models/compraCliente.js
const compraClienteSchema = new mongoose.Schema({
  cliente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'usuario', // Referencia a tu modelo de usuario
    required: true 
  },
  productos: [
    {
      repuesto: { type: mongoose.Schema.Types.ObjectId, ref: 'repuesto' },
      nombre: String,
      cantidad: Number,
      precioUnitario: Number
    }
  ],
  total: Number,
  fecha: { type: Date, default: Date.now },
  metodoPago: String
});
const CompraCliente = require('../models/compraCliente');

exports.getMisComprasPorId = async (req, res) => {
    try {
        const { clienteId } = req.params; // Extrae el ID de la URL
        const compras = await CompraCliente.find({ cliente: clienteId }).sort({ fecha: -1 });
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar compras" });
    }
};