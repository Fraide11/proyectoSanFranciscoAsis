require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

// 1. IMPORTACIONES
const { conectarDB } = require('./config/db');
const { generarRespaldoInterno } = require('./controllers/backupController');
const chatRoutes = require('./routes/chatRoutes');
// Importamos el archivo con el nombre correcto que definimos antes
const repuestosRoutes = require('./routes/repuestos.routes'); 

const app = express(); // <--- IMPORTANTE: Definir 'app' antes de usarla

// Conexión a Base de Datos
conectarDB();

// 2. MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (para las fotos o el build del front)
app.use(express.static(path.join(__dirname, '../public')));

// 3. RUTAS
app.use('/api/chat', chatRoutes);
app.use('/api/repuestos', repuestosRoutes); // Ruta de repuestos principal
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// 4. AUTOMATIZACIÓN (CRON JOB)
cron.schedule('0 0 * * *', async () => {
    console.log('--- Iniciando Respaldo Automático Diario ---');
    try {
        await generarRespaldoInterno(); 
        console.log('✅ Respaldo completado con éxito.');
    } catch (error) {
        console.error('❌ Error en el respaldo automático:', error.message);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor volando en puerto ${PORT}`);
    console.log(`🛠️  Listo para San Francisco de Asís`);
});