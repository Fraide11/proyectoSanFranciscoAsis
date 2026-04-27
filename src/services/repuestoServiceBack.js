const LogUpdate = require('../models/logsUpdate');
const Repuesto = require('../models/repuesto');

/**
 * Compara los campos específicos y guarda en la colección LogUpdate 
 * solo si hubo cambios reales.
 */
const compararYRegistrarCambios = async (idRepuesto, datosViejos, datosNuevos, idUsuario) => {
    const cambios = [];
    // Campos que el sistema vigila para auditoría
    const camposAMonitorear = ['nombre', 'precioVenta', 'costoCompra', 'stock', 'estante', 'codigo', 'marcaCarro', 'modeloCarro'];

    camposAMonitorear.forEach(campo => {
        // Normalizamos a String para evitar falsos positivos (ej: 100 vs "100")
        if (datosNuevos[campo] !== undefined && String(datosViejos[campo]) !== String(datosNuevos[campo])) {
            cambios.push({
                campo: campo,
                valorAnterior: datosViejos[campo],
                valorNuevo: datosNuevos[campo]
            });
        }
    });

    // Si hubo cambios en los campos vigilados, generamos el log
    if (cambios.length > 0) {
        const nuevoLog = new LogUpdate({
            repuestoId: idRepuesto,
            usuarioId: idUsuario,
            accion: 'EDICIÓN', // Identificador de la operación
            cambios: cambios,   // Array granular de diferencias
            fecha: new Date()
        });
        
        await nuevoLog.save();
        console.log(`✅ Log de auditoría (EDICIÓN) guardado para ID: ${idRepuesto}`);
    } else {
        console.log("ℹ️ Actualización omitida en logs: No hubo cambios en campos críticos.");
    }
};

/**
 * Orquestador: Gestiona la actualización del repuesto y dispara la auditoría.
 */
const actualizarRepuestoConLog = async (id, dataNueva, usuarioId) => {
    // 1. Obtener estado actual para tener con qué comparar
    const repuestoAnterior = await Repuesto.findById(id);
    if (!repuestoAnterior) {
        throw new Error('Repuesto no encontrado');
    }

    // 2. Aplicar cambios en la base de datos
    const repuestoActualizado = await Repuesto.findByIdAndUpdate(
        id, 
        dataNueva, 
        { new: true, runValidators: true }
    );

    // 3. Ejecutar comparación y registro de log
    // Lo mantenemos con await para asegurar que el log se guarde antes de responder
    await compararYRegistrarCambios(
        id, 
        repuestoAnterior, 
        dataNueva, 
        usuarioId
    );

    return repuestoActualizado;
};

module.exports = {
    actualizarRepuestoConLog,
    compararYRegistrarCambios
};