const fs = require('fs');
const path = require('path');
const Repuesto = require('../models/repuesto');
const Venta = require('../models/venta');
const Usuario = require('../models/usuario');
const Auditoria = require('../models/auditoria');
const { registrarLog } = require('../services/auditoriaService');

// Asegurar que la carpeta de backups exista al arrancar el módulo
const backupDir = path.join(__dirname, '../storage/backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// @desc    Generar un respaldo completo de la base de datos
// @route   POST /api/admin/backup
const crearRespaldoManual = async (req, res) => {
    try {
        // 1. Recopilamos toda la información (usamos .lean() para que sea más rápido y consuma menos RAM)
        const datos = {
            repuestos: await Repuesto.find({}).lean(),
            ventas: await Venta.find({}).lean(),
            usuarios: await Usuario.find({}).lean(),
            auditoria: await Auditoria.find({}).lean(),
            fechaRespaldo: new Date()
        };

        // 2. Definimos el nombre con timestamp para evitar colisiones si se hacen varios el mismo día
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const nombreArchivo = `backup_SF_${timestamp}.json`;
        const rutaArchivo = path.join(backupDir, nombreArchivo);

        // 3. Escribimos el archivo
        fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2));

        // AUDITORÍA: Registrar quién hizo el respaldo
        await registrarLog(
            req.user?.id, 
            'BACKUP', 
            'SISTEMA', 
            `Generó respaldo manual: ${nombreArchivo}`
        );

        res.status(200).json({
            status: 'success',
            message: 'Respaldo generado correctamente en el servidor',
            archivo: nombreArchivo,
            nota: 'Recuerda descargar este archivo, el almacenamiento de Render es temporal.'
        });

    } catch (error) {
        console.error('Error en Backup:', error);
        res.status(500).json({ status: 'error', message: 'Fallo al generar el archivo de respaldo' });
    }
};

// Función para el CRON (Usa la misma lógica pero silenciosa)
const generarRespaldoInterno = async () => {
    try {
        const datos = {
            repuestos: await Repuesto.find({}).lean(),
            ventas: await Venta.find({}).lean(),
            usuarios: await Usuario.find({}).lean(),
            fecha: new Date()
        };
        const nombre = `auto_backup_${new Date().toISOString().split('T')[0]}.json`;
        fs.writeFileSync(path.join(backupDir, nombre), JSON.stringify(datos, null, 2));
        console.log(`✅ Respaldo automático generado: ${nombre}`);
    } catch (err) {
        console.error('❌ Error en respaldo automático:', err);
    }
};

// EXPORTACIÓN ÚNICA (Corregido)
module.exports = { 
    crearRespaldoManual, 
    generarRespaldoInterno 
};