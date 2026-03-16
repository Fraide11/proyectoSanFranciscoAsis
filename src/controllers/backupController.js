const fs = require('fs');
const path = require('path');
const Repuesto = require('../models/repuesto');
const Venta = require('../models/venta');
const Usuario = require('../models/usuario');
const Auditoria = require('../models/auditoria');

// @desc    Generar un respaldo completo de la base de datos
// @route   POST /api/admin/backup
const crearRespaldoManual = async (req, res) => {
    try {
        // 1. Recopilamos toda la información de la DB
        const datos = {
            repuestos: await Repuesto.find({}),
            ventas: await Venta.find({}),
            usuarios: await Usuario.find({}),
            auditoria: await Auditoria.find({}),
            fechaRespaldo: new Date()
        };

        // 2. Definimos el nombre del archivo con la fecha actual
        const nombreArchivo = `backup_${new Date().toISOString().split('T')[0]}.json`;
        const rutaArchivo = path.join(__dirname, '../storage/backups', nombreArchivo);

        // 3. Escribimos el archivo JSON
        fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2));

        res.status(200).json({
            status: 'success',
            message: 'Respaldo generado correctamente',
            archivo: nombreArchivo
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Esta función la llama el CRON (no necesita req/res)
const generarRespaldoInterno = async () => {
    const Repuesto = require('../models/repuesto');
    const Venta = require('../models/venta');
    const Usuario = require('../models/usuario');
    
    const datos = {
        repuestos: await Repuesto.find({}),
        ventas: await Venta.find({}),
        usuarios: await Usuario.find({}),
        fecha: new Date()
    };

    const nombreArchivo = `auto_backup_${new Date().toISOString().split('T')[0]}.json`;
    const ruta = path.join(__dirname, '../storage/backups', nombreArchivo);
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
};

// No olvides exportarla
module.exports = { crearRespaldoManual, generarRespaldoInterno };

module.exports = { crearRespaldoManual };