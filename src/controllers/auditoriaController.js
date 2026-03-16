const Auditoria = require('../models/auditoria');

const registrarLog = async (usuarioId, accion, modulo, detalles) => {
    try {
        const log = new Auditoria({
            usuario: usuarioId,
            accion,
            modulo,
            detalles
        });
        await log.save();
    } catch (error) {
        console.error('Error guardando auditoría:', error);
    }
};

module.exports = { registrarLog };