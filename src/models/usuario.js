const mongoose = require('mongoose');
const bcrypt = require ('bcrypt');
const { match } = require('assert');

const UsuarioSchema = new mongoose.Schema({
        nombre:{
            type:String,
            require: [true, 'porfavor agregue un nombre']
        },
        email:{
            type: String,
            require: [true, 'porfavor agregue su correo'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'correo invalido']
        },
        rol: {
        type: String,
        enum: ['admin', 'vendedor', 'cliente'],
        default: 'cliente'
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

//encriptar las contras antes de guardar
UsuarioSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.gentSalt(10);
    this.password = await  bcrypt.hash(this.password, salt);
});


// metodo para comparar contras al hacer login
UsuarioSchema.methods.compararPassword = async function(passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

module.export = mongoose.model('Usuario', UsuarioSchema)