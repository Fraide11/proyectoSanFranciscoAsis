require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

// 1. CONFIGURACIONES BÁSICAS
const { conectarDB } = require('./config/db');
const { generarRespaldoInterno } = require('./controllers/backupController');
const { obtenerStockBajo, obtenerInventarioCompleto } = require('./controllers/reportesController');
const { updateTasa } = require('./controllers/tasaController');
const deliveryRoutes = require('./routes/delivery.routes');
const logsUpdateRoutes = require('./routes/logsUpdate.routes.js');

const app = express();

// 2. MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// 3. RUTAS (API ENDPOINTS)
// Importamos directamente en el app.use para evitar errores de referencia
app.use('/api/tasa', require('./routes/tasa.routes'));
app.use('/api/pedidos', require('./routes/pedidoRoutes'));
app.use('/api/auth', require('./routes/auth.routes')); 
app.use('/api/repuestos', require('./routes/repuestos.routes')); 
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/worker', require('./routes/worker.routes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/estadisticas', require('./routes/estadisticas.routes'));
app.use('/api/delivery', deliveryRoutes);
app.use('/api/logs-update', logsUpdateRoutes);

// Rutas de Reportes
app.get('/api/reportes/stock-bajo', obtenerStockBajo);
app.get('/api/reportes/inventario-completo', obtenerInventarioCompleto);

// PRUEBA RÁPIDA DE CONEXIÓN
app.get('/api/test', (req, res) => {
    res.json({ msg: "Conexión exitosa con San Francisco de Asís" });
});

// 4. MANEJO DE ERRORES GLOBAL
app.use((err, req, res, next) => {
    console.error('⚠️ ERROR DETECTADO:', err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        status: 'error', 
        message: err.message || 'Error interno en el servidor',
        debug: process.env.NODE_ENV === 'development' ? err.stack : {} 
    });
});

// 5. AUTOMATIZACIÓN (Respaldo diario a medianoche)
cron.schedule('0 0 * * *', async () => {
    try {
        await generarRespaldoInterno(); 
        console.log('✅ Respaldo diario completado.');
    } catch (error) {
        console.error('❌ Error en respaldo:', error.message);
    }
});

// 6. ARRANQUE DEL SERVIDOR (Conexión DB + Tasa Inicial)
const PORT = process.env.PORT || 10000;

const start = async () => {
    try {
        await conectarDB();
        console.log("✅ MongoDB Conectado correctamente");

        // Intentar actualizar tasa inicial pero sin tumbar el server si la API falla
        try {
            console.log("📈 Actualizando tasa de cambio...");
            await updateTasa();
        } catch (tasaErr) {
            console.log("⚠️ No se pudo actualizar la tasa (DolarApi), se usará la última guardada.");
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor volando en puerto ${PORT}`);
            console.log(`🛠️  Sistema Automotriz San Francisco de Asís - LISTO`);
        });
    } catch (error) {
        console.error("❌ ERROR CRÍTICO AL ARRANCAR:", error.message);
        process.exit(1);
    }
};

start();