const Repuesto = require('../models/repuesto');

// 1. Registrar nuevo repuesto (POST)
const crearRepuesto = async (req, res) => {
    try {
        const nuevoRepuesto = new Repuesto(req.body);
        await nuevoRepuesto.save();
        res.status(201).json({ status: 'success', data: nuevoRepuesto });
    } catch (error) {
        // Manejo específico para el error de código duplicado
        if (error.code === 11000) {
            return res.status(400).json({ status: 'error', message: 'El código SKU ya existe' });
        }
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// 2. Búsqueda avanzada de repuestos (GET)
// Esta es la clave para que la barra de búsqueda de la tienda sea rápida
const obtenerInventario = async (req, res) => {
    try {
        const { query } = req.query; 
        let filtro = {};

        if (query) {
            filtro = {
                $or: [
                    { nombre: { $regex: query, $options: 'i' } },
                    { marcaCarro: { $regex: query, $options: 'i' } },
                    { modeloCarro: { $regex: query, $options: 'i' } },
                    { codigo: { $regex: query, $options: 'i' } }
                ]
            };
        }

        const repuestos = await Repuesto.find(filtro).sort({ createdAt: -1 });
        res.status(200).json(repuestos);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// 3. Actualizar stock o precio (PUT)
const actualizarRepuesto = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await Repuesto.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!actualizado) return res.status(404).json({ message: 'Repuesto no encontrado' });
        
        res.status(200).json({ message: 'Actualizado correctamente', actualizado });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { crearRepuesto, obtenerInventario, actualizarRepuesto };