const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./src/models/usuario'); 
require('dotenv').config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('--- Conectado a MongoDB ---');

    const emailAdmin = 'admin@sanfrancisco.com';
    const nuevaClave = 'admin1234'; // <--- Cambia aquí la clave que quieras usar
    const nuevoUser = 'admin';      // <--- El usuario que pones en el login

    // Encriptar la nueva contraseña
    // ... arriba igual
// Encriptar la nueva contraseña
const salt = await bcrypt.genSalt(10); // <--- Cambio aquí: genSalt en lugar de getSalt
const hashedPass = await bcrypt.hash(nuevaClave, salt);
// ... abajo igual

    // Buscar y actualizar, o crear si no existe (upsert)
    const adminActualizado = await Usuario.findOneAndUpdate(
      { email: emailAdmin }, 
      { 
        nombre: 'Admin San Francisco',
        usuario: nuevoUser,
        password: hashedPass,
        rol: 'admin' 
      },
      { new: true, upsert: true }
    );

    console.log(`✅ Administrador configurado correctamente:`);
    console.log(`📧 Email: ${emailAdmin}`);
    console.log(`👤 Usuario: ${nuevoUser}`);
    console.log(`🔑 Nueva Clave: ${nuevaClave}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error actualizando el admin:', error);
    process.exit(1);
  }
};

resetAdmin();