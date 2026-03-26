const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Por favor agregue un nombre'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Por favor agregue su correo'],
        unique: true,
        lowercase: true, // Siempre se guarda en minúsculas
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor agregue un correo válido']
    },
    password: {
        type: String,
        required: [true, 'Por favor agregue una contraseña'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false // No se incluye en las consultas por defecto
    },
    rol: {
        type: String,
        enum: {
            values: ['admin', 'vendedor', 'cliente'],
            message: '{VALUE} no es un rol válido'
        },
        default: 'cliente'
    },
    activo: { // Útil para "suspender" cuentas sin borrarlas
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true,
    versionKey: false 
});

// Encriptar contraseña antes de guardar
UsuarioSchema.pre('save', async function (next) {
    // Si la contraseña no ha sido modificada, pasamos al siguiente middleware
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas en el Login
UsuarioSchema.methods.compararPassword = async function(passwordIngresada) {
    // Como password tiene select: false, hay que asegurarse de que esté cargada
    return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);