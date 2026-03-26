const Repuesto = require('../models/repuesto');

// @desc    Obtener todos los repuestos (con filtros)
// @route   GET /api/repuestos
exports.getRepuestos = async (req, res) => {
    try {
        const { marca, modelo, buscar } = req.query;
        let query = {};

        // Filtros para la búsqueda
        if (marca) query.marcaCarro = marca;
        if (modelo) query.modeloCarro = modelo;
        if (buscar) {
            query.$or = [
                { nombre: { $regex: buscar, $options: 'i' } },
                { codigo: { $regex: buscar, $options: 'i' } }
            ];
        }

        const repuestos = await Repuesto.find(query);
        res.json(repuestos);
    } catch (err) {
        res.status(500).json({ msg: "Error al obtener repuestos", error: err.message });
    }
};

// @desc    Crear un nuevo repuesto
// @route   POST /api/repuestos
exports.createRepuesto = async (req, res) => {
    try {
        // El req.body debe traer los campos que definimos en tu modelo
        const nuevoRepuesto = new Repuesto(req.body);
        const repuestoGuardado = await nuevoRepuesto.save();
        res.status(201).json(repuestoGuardado);
    } catch (err) {
        res.status(400).json({ msg: "Error al crear repuesto", error: err.message });
    }
};

// @desc    Actualizar Stock (Vital para ventas)
// @route   PUT /api/repuestos/:id/stock
exports.updateStock = async (req, res) => {
    try {
        const { cantidad } = req.body; // Puede ser positivo o negativo
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
// @route   DELETE /api/repuestos/:id
exports.deleteRepuesto = async (req, res) => {
    try {
        await Repuesto.findByIdAndDelete(req.params.id);
        res.json({ msg: "Repuesto eliminado del sistema" });
    } catch (err) {
        res.status(500).json({ msg: "Error al eliminar" });
    }
};