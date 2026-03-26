const Repuesto = require('../models/repuesto');
const { registrarLog } = require('../services/auditoriaService');

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
                { marcaCarro: { $regex: buscar, $options: 'i' } },
                { modeloCarro: { $regex: buscar, $options: 'i' } }
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

        // AUDITORÍA: Registro de creación
        await registrarLog(req.user?.id, 'CREAR', 'REPUESTOS', { 
            nombre: repuestoGuardado.nombre, 
            sku: repuestoGuardado.codigo 
        });

        res.status(201).json(repuestoGuardado);
    } catch (err) {
        res.status(400).json({ msg: "Error al crear: Verifica si el código ya existe", error: err.message });
    }
};

// @desc    Actualizar TODO el repuesto
exports.updateRepuesto = async (req, res) => {
    try {
        const actualizado = await Repuesto.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        );
        
        if (!actualizado) return res.status(404).json({ msg: "Repuesto no encontrado" });

        // AUDITORÍA: Registro de edición
        await registrarLog(req.user?.id, 'EDITAR', 'REPUESTOS', `Actualizó datos de: ${actualizado.nombre}`);

        res.json(actualizado);
    } catch (err) {
        res.status(400).json({ msg: "Error al actualizar datos", error: err.message });
    }
};

// @desc    Actualizar Stock (Específico para ventas o entradas)
exports.updateStock = async (req, res) => {
    try {
        const { cantidad } = req.body;
        const repuesto = await Repuesto.findById(req.params.id);

        if (!repuesto) return res.status(404).json({ msg: "Repuesto no encontrado" });

        const cambio = parseInt(cantidad);
        if (isNaN(cambio)) return res.status(400).json({ msg: "La cantidad debe ser un número" });

        const stockAnterior = repuesto.stock;
        repuesto.stock += cambio;
        if (repuesto.stock < 0) repuesto.stock = 0;

        await repuesto.save();

        // AUDITORÍA: Registro de movimiento de inventario
        await registrarLog(req.user?.id, 'STOCK', 'REPUESTOS', {
            producto: repuesto.nombre,
            cambio: cambio,
            antes: stockAnterior,
            ahora: repuesto.stock
        });

        res.json({ msg: "Stock actualizado con éxito", nuevoStock: repuesto.stock });
    } catch (err) {
        res.status(500).json({ msg: "Error al procesar el stock" });
    }
};

// @desc    Eliminar repuesto
exports.deleteRepuesto = async (req, res) => {
    try {
        const repuestoEliminado = await Repuesto.findByIdAndDelete(req.params.id);
        if (!repuestoEliminado) return res.status(404).json({ msg: "El repuesto no existe" });
        
        // AUDITORÍA: Registro de eliminación (Crítico)
        await registrarLog(req.user?.id, 'ELIMINAR', 'REPUESTOS', `Eliminó el producto: ${repuestoEliminado.nombre} (SKU: ${repuestoEliminado.codigo})`);

        res.json({ msg: "Repuesto eliminado del sistema correctamente" });
    } catch (err) {
        res.status(500).json({ msg: "Error interno al eliminar" });
    }
};