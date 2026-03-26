const Auditoria = require('../models/auditoria');

/**
 * Registra una acción en la bitácora del sistema.
 * @param {String} usuarioId - ID del usuario que realiza la acción.
 * @param {String} accion - Ej: 'CREAR', 'EDITAR', 'ELIMINAR', 'LOGIN'.
 * @param {String} modulo - Ej: 'REPUESTOS', 'USUARIOS', 'VENTAS'.
 * @param {Object|String} detalles - Información adicional de la operación.
 */
const registrarLog = async (usuarioId, accion, modulo, detalles) => {
    try {
        const log = new Auditoria({
            usuario: usuarioId,
            accion: accion.toUpperCase(), // Normalizamos a mayúsculas
            modulo: modulo.toUpperCase(),
            detalles: typeof detalles === 'object' ? JSON.stringify(detalles) : detalles,
            fecha: new Date() // Aseguramos la estampa de tiempo
        });

        // Usamos save() pero no necesariamente esperamos a que termine 
        // para no ralentizar la respuesta al usuario final (Fire and forget opcional)
        await log.save();
        
    } catch (error) {
        // En auditoría, el error se loguea en consola para no detener la ejecución principal
        console.error('⚠️ ALERTA DE SEGURIDAD - Error en Log de Auditoría:', error.message);
    }
};

module.exports = { registrarLog };