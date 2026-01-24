const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Agregado para evitar bloqueos del navegador
require('dotenv').config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// --- 1. CONFIGURACIÓN (Middleware) ---
app.use(cors());
app.use(express.json()); // <--- ¡FALTA ESTO! Para poder leer req.body
app.use(express.static('public'));

// --- 2. CONEXIÓN A MONGODB ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ ¡Conexión exitosa a MongoDB Atlas!'))
  .catch(err => console.error('❌ Error de conexión:', err));

// --- 3. MODELO DE DATOS (El "molde" para Atlas) ---
const RegistroSchema = new mongoose.Schema({
    choco: String, // Aquí se guarda lo que viene del input "coco"
    fecha: { type: Date, default: Date.now }
});
const Registro = mongoose.model('Registro', RegistroSchema);

// --- 4. RUTAS (Endpoints) ---

// Recibir datos del HTML y guardar en la nube
app.post('/api/caja', async (req, res) => {
    try {
        const nuevoRegistro = new Registro(req.body); 
        await nuevoRegistro.save(); // Guarda en MongoDB Atlas
        
        console.log("¡Dato guardado en la nube!:", req.body);
        res.status(201).json({ mensaje: "Guardado en Atlas", dato: nuevoRegistro });
    } catch (error) {
        res.status(500).json({ error: "No se pudo guardar en la base de datos" });
    }
});

// Ver todos los registros guardados
app.get('/api/caja', async (req, res) => {
    const todos = await Registro.find(); // Busca todo en la nube
    res.json(todos);
});

// --- 5. ENCENDER SERVIDOR ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});