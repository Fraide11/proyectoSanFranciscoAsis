const Repuesto = require('../models/repuesto');

// @desc    Obtener todos los repuestos (con filtros)
exports.getRepuestos = async (req, res) => {
    try {
        const { marca, modelo, buscar } = req.query;
        let query = {};

        if (marca) query.marcaCarro = marca;
        if (modelo) query.modeloCarro = modelo;
        if (buscar) {
            query.$or = [
                { nombre: { $regex: buscar, $options: 'i' } },
                { codigo: { $regex: buscar, $options: 'i' } },
                { marcaCarro: { $regex: buscar, $options: 'i' } } // Añadí marca a la búsqueda global
            ];
        }

        const repuestos = await Repuesto.find(query).sort({ createdAt: -1 });
        res.json(repuestos);
    } catch (err) {
        res.status(500).json({ msg: "Error al obtener repuestos", error: err.message });
    }
};

// @desc    Crear un nuevo repuesto
exports.createRepuesto = async (req, res) => {
    try {
        const nuevoRepuesto = new Repuesto(req.body);
        const repuestoGuardado = await nuevoRepuesto.save();
        res.status(201).json(repuestoGuardado);
    } catch (err) {
        res.status(400).json({ msg: "Error al crear repuesto", error: err.message });
    }
};

// @desc    ACTUALIZAR TODO EL REPUESTO (Para el botón Editar de React)
// @route   PUT /api/repuestos/:id
exports.updateRepuesto = async (req, res) => {
    try {
        const actualizado = await Repuesto.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        if (!actualizado) return res.status(404).json({ msg: "Repuesto no encontrado" });
        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ msg: "Error al actualizar", error: err.message });
    }
};

// @desc    Actualizar Stock (Útil para ventas rápidas)
exports.updateStock = async (req, res) => {
    try {
        const { cantidad } = req.body;
        const repuesto = await Repuesto.findById(req.params.id);
        if (!repuesto) return res.status(404).json({ msg: "Repuesto no encontrado" });

        repuesto.stock += cantidad;
        await repuesto.save();
        res.json({ msg: "Stock actualizado", nuevoStock: repuesto.stock });
    } catch (err) {
        res.status(500).json({ msg: "Error al actualizar stock" });
    }
};

// @desc    Eliminar repuesto
exports.deleteRepuesto = async (req, res) => {
    try {
        await Repuesto.findByIdAndDelete(req.params.id);
        res.json({ msg: "Repuesto eliminado del sistema" });
    } catch (err) {
        res.status(500).json({ msg: "Error al eliminar" });
    }
};