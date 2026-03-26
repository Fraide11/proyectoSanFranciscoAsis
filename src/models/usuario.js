const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor agregue un nombre']
    },
    email: {
        type: String,
        required: [true, 'Por favor agregue su correo'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Correo inválido']
    },
    password: { // <--- ESTO FALTABA
        type: String,
        required: [true, 'Por favor agregue una contraseña'],
        minlength: 6,
        select: false // Para que no se envíe la clave en los GET por seguridad
    },
    rol: {
        type: String,
        enum: ['admin', 'vendedor', 'cliente'],
        default: 'cliente'
    }
}, { timestamps: true });

// Encriptar contraseña
UsuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10); // <--- Corregido: genSalt
    this.password = await bcrypt.hash(this.password, salt);
});

// Comparar contraseña
UsuarioSchema.methods.compararPassword = async function(passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema); // <--- Corregido: exports