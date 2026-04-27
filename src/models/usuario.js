const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre de usuario es obligatorio'], 
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'El correo electrónico es obligatorio'], 
        unique: true, 
        lowercase: true, 
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor agregue un correo válido']
    },
    password: { 
        type: String, 
        required: [true, 'La clave es obligatoria'], 
        minlength: [6, 'La clave debe tener al menos 6 caracteres'], 
        select: false 
    },
    rol: { 
        type: String, 
        enum: {
            values: ['admin', 'trabajador', 'cliente'],
            message: '{VALUE} no es un rol válido'
        }, 
        default: 'cliente' 
    },
    activo: { 
        type: Boolean, 
        default: true 
    },
    // Campos para recuperación de contraseña
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { 
    timestamps: true,
    versionKey: false 
});

/**
 * Middleware para encriptar clave antes de guardar
 */
UsuarioSchema.pre('save', async function () {
    // Si la clave no se modificó, no hacemos nada y Mongoose sigue solo
    if (!this.isModified('password')) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // NO llamar a next() aquí si la función es async
    } catch (error) {
        // Si hay error, lanzamos el error y Mongoose lo captura
        throw error;
    }
});

/**
 * Método para comparar claves en el Login
 */
UsuarioSchema.methods.compararPassword = async function(passwordIngresada) {
    // Recuerda usar .select('+password') en la consulta del controlador
    return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);