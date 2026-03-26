require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

// 1. IMPORTACIONES DE CONFIGURACIÓN Y CONTROLADORES
const { conectarDB } = require('./config/db');
const { generarRespaldoInterno } = require('./controllers/backupController');

// 2. INICIALIZACIÓN
const app = express();
conectarDB();

// 3. MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta para archivos estáticos (Imágenes de repuestos, PDFs, etc.)
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// 4. DEFINICIÓN DE RUTAS (API ENDPOINTS)
app.use('/api/auth', require('./routes/auth.routes')); // <--- Fundamental para el Login
app.use('/api/repuestos', require('./routes/repuestos.routes')); 
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// 5. MANEJO DE ERRORES (Evita que el servidor muera por errores no capturados)
app.use((err, req, res, next) => {
    console.error('⚠️ ERROR INTERNO:', err.stack);
    res.status(500).json({ 
        status: 'error', 
        message: 'Algo salió mal en el servidor de San Francisco de Asís' 
    });
});

// 6. AUTOMATIZACIÓN (CRON JOB - 12:00 AM)
cron.schedule('0 0 * * *', async () => {
    console.log('--- 🛡️ Iniciando Respaldo Automático Diario ---');
    try {
        await generarRespaldoInterno(); 
        console.log('✅ Respaldo completado con éxito.');
    } catch (error) {
        console.error('❌ Error en el respaldo automático:', error.message);
    }
});

// 7. ARRANQUE DEL SERVIDOR
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor volando en puerto ${PORT}`);
    console.log(`📍 Entorno: ${process.env.NODE_ENV || 'Desarrollo'}`);
    console.log(`🛠️  Sistema de Inventario San Francisco de Asís - Listo`);
});