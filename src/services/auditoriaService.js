const Auditoria = require('../models/auditoria');

/**
 * Registra una acción en la bitácora del sistema.
 */
const registrarLog = async (usuarioId, accion, modulo, detalles = "Sin detalles adicionales") => {
    try {
        const nuevoLog = new Auditoria({
            // Si usuarioId es null o undefined, se guardará como null sin dar error
            usuario: usuarioId || null, 
            
            accion: accion ? accion.toUpperCase() : 'ACCION_DESCONOCIDA',
            modulo: modulo ? modulo.toUpperCase() : 'SISTEMA',
            
            // Convierte objetos/arrays a string para que quepan en la base de datos
            detalles: (typeof detalles === 'object' && detalles !== null) 
                ? JSON.stringify(detalles) 
                : detalles,
            
            fecha: new Date()
        });

        await nuevoLog.save();
        console.log(`✅ Log registrado: ${accion} en ${modulo}`);
        
    } catch (error) {
        // Esto evita que un error en la auditoría detenga toda la aplicación
        console.error("❌ Error crítico al guardar log de auditoría:", error.message);
    }
};

module.exports = { registrarLog };