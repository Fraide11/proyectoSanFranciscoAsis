const Repuesto = require('../models/repuesto');
const { registrarLog } = require('../services/auditoriaService');
const repuestoServiceBack = require('../services/repuestoServiceBack'); // El nuevo servicio para LogUpdate

// @desc    Obtener todos los repuestos (con búsqueda y filtros)
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
        return res.json(repuestos);
    } catch (err) {
        console.error("Error en getRepuestos:", err.message);
        return res.status(500).json({ 
            msg: "Error al obtener repuestos", 
            error: err.message 
        });
    }
};

// @desc    Crear un nuevo repuesto
exports.createRepuesto = async (req, res) => {
    try {
        // 1. Limpieza y normalización de datos
        const datos = {
            ...req.body,
            codigo: req.body.codigo?.trim().toUpperCase(),
            precioVenta: Number(req.body.precioVenta) || 0,
            costoCompra: Number(req.body.costoCompra) || 0,
            stock: Number(req.body.stock) || 0,
            stockMinimo: Number(req.body.stockMinimo) || 2
        };

        // 2. Guardar en la base de datos
        const nuevoRepuesto = new Repuesto(datos);
        const repuestoGuardado = await nuevoRepuesto.save();

        // 3. Auditoría Segura (Encapsulada para no romper la respuesta principal)
        try {
            if (registrarLog && req.user) {
                await registrarLog(req.user.id, 'CREAR', 'REPUESTOS', { 
                    nombre: repuestoGuardado.nombre, 
                    sku: repuestoGuardado.codigo 
                });
            }
        } catch (logErr) {
            console.warn("⚠️ Fallo log de auditoría:", logErr.message);
        }

        // 4. Respuesta exitosa
        return res.status(201).json(repuestoGuardado);

    } catch (err) {
        console.error("❌ Error en createRepuesto:", err.message);
        
        // Manejo de duplicados (Código SKU ya existente)
        if (err.code === 11000) {
            return res.status(400).json({ 
                msg: "El código SKU ya existe en el sistema", 
                error: "Duplicado" 
            });
        }

        // Manejo de errores de validación de Mongoose
        return res.status(400).json({ 
            msg: "Error de validación: Revisa los campos obligatorios", 
            error: err.message 
        });
    }
};

// @desc    Actualizar el repuesto
// @desc    Actualizar el repuesto con LogUpdate detallado
exports.updateRepuesto = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id; // Asumiendo que req.user viene del middleware de auth
        const datosNuevos = { ...req.body };
        
        // Normalización de datos
        if (datosNuevos.precioVenta !== undefined) datosNuevos.precioVenta = Number(datosNuevos.precioVenta);
        if (datosNuevos.stock !== undefined) datosNuevos.stock = Number(datosNuevos.stock);
        if (datosNuevos.codigo) datosNuevos.codigo = datosNuevos.codigo.trim().toUpperCase();

        // USAMOS EL SERVICIO BACK PARA LOGUPDATE
        // Esta función busca el anterior, actualiza y guarda en la colección LogUpdate
        const actualizado = await repuestoServiceBack.actualizarRepuestoConLog(
            id, 
            datosNuevos, 
            usuarioId
        );

        // Auditoría General (La que ya tenías)
        try {
            if (registrarLog && req.user) {
                await registrarLog(req.user.id, 'EDITAR', 'REPUESTOS', `Actualizó: ${actualizado.nombre} (${actualizado.codigo})`);
            }
        } catch (logErr) {}

        return res.json(actualizado);

    } catch (err) {
        console.error("❌ Error en updateRepuesto:", err.message);
        if (err.message === 'Repuesto no encontrado') {
            return res.status(404).json({ msg: err.message });
        }
        return res.status(400).json({ 
            msg: "Error al actualizar datos", 
            error: err.message 
        });
    }
};


exports.actualizarRepuesto = async (req, res) => {
    try {
        const { id } = req.params;
        const repuestoAnterior = await Repuesto.findById(id);

        if (!repuestoAnterior) return res.status(404).json({ message: "No existe" });

        // Actualizamos el repuesto
        const repuestoActualizado = await Repuesto.findByIdAndUpdate(id, req.body, { new: true });

        // LLAMADA AL SERVICIO DE LOGS (Aquí es donde se guarda)
        // Pasamos: ID del repuesto, data vieja, data nueva (req.body) e ID del usuario (req.usuario.id)
        await repuestoServiceBack.compararYRegistrarCambios(
            id, 
            repuestoAnterior, 
            req.body, 
            req.usuario.id 
        );

        res.json(repuestoActualizado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
    }
};



// @desc    Eliminar repuesto
exports.deleteRepuesto = async (req, res) => {
    try {
        const repuestoEliminado = await Repuesto.findByIdAndDelete(req.params.id);
        
        if (!repuestoEliminado) {
            return res.status(404).json({ msg: "El repuesto no existe" });
        }
        
        // Auditoría Segura
        try {
            if (registrarLog && req.user) {
                await registrarLog(req.user.id, 'ELIMINAR', 'REPUESTOS', `Eliminó SKU: ${repuestoEliminado.codigo}`);
            }
        } catch (logErr) {}

        return res.json({ msg: "Repuesto eliminado correctamente" });
    } catch (err) {
        console.error("❌ Error en deleteRepuesto:", err.message);
        return res.status(500).json({ 
            msg: "Error interno al eliminar", 
            error: err.message 
        });
    }
};