const Repuesto = require('../models/repuesto');
const { registrarLog } = require('../services/auditoriaService');

// 1. Registrar nuevo repuesto (POST)
const crearRepuesto = async (req, res) => {
    try {
        const nuevoRepuesto = new Repuesto(req.body);
        await nuevoRepuesto.save();

        // AUDITORÍA: Registro de creación
        await registrarLog(
            req.user?.id, 
            'CREAR', 
            'INVENTARIO', 
            `Añadió: ${nuevoRepuesto.nombre} (SKU: ${nuevoRepuesto.codigo})`
        );

        res.status(201).json({ status: 'success', data: nuevoRepuesto });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: 'error', message: 'El código SKU ya existe' });
        }
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// 2. Búsqueda avanzada (GET) - La clave de la barra de búsqueda
const obtenerInventario = async (req, res) => {
    try {
        const { query } = req.query; 
        let filtro = {};

        if (query) {
            // Sanitización: Evita que caracteres especiales rompan el Regex
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            filtro = {
                $or: [
                    { nombre: { $regex: escapedQuery, $options: 'i' } },
                    { marcaCarro: { $regex: escapedQuery, $options: 'i' } },
                    { modeloCarro: { $regex: escapedQuery, $options: 'i' } },
                    { codigo: { $regex: escapedQuery, $options: 'i' } }
                ]
            };
        }

        // .lean() aumenta la velocidad de respuesta en el catálogo
        const repuestos = await Repuesto.find(filtro)
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(repuestos);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al consultar inventario' });
    }
};

// 3. Actualizar stock o datos (PUT)
const actualizarRepuesto = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Obtenemos el estado previo para comparar en la auditoría
        const anterior = await Repuesto.findById(id).lean();
        if (!anterior) return res.status(404).json({ message: 'Repuesto no encontrado' });

        const actualizado = await Repuesto.findByIdAndUpdate(id, req.body, { 
            new: true, 
            runValidators: true 
        });
        
        // AUDITORÍA: Registro de cambio de stock o precio
        await registrarLog(
            req.user?.id, 
            'ACTUALIZAR', 
            'INVENTARIO', 
            `Modificó ${actualizado.nombre}. Stock: ${anterior.stock} -> ${actualizado.stock}`
        );

        res.status(200).json({ message: 'Actualizado correctamente', actualizado });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { crearRepuesto, obtenerInventario, actualizarRepuesto };
