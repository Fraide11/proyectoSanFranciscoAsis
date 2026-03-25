const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerWorker = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si ya existe
        let usuario = await Usuario.findOne({ email });
        if (usuario) return res.status(400).json({ msg: "El usuario ya existe" });

        // Crear nuevo trabajador
        usuario = new Usuario({
            nombre,
            email,
            password,
            rol: 'trabajador' // Forzamos el rol aquí
        });

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        await usuario.save();
        res.json({ msg: "Trabajador registrado exitosamente", usuario: { nombre, email, rol: 'trabajador' } });
    } catch (err) {
        res.status(500).send("Error al registrar trabajador");
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ msg: "Credenciales inválidas" });

        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) return res.status(400).json({ msg: "Credenciales inválidas" });

        // Crear JWT incluyendo el ROL
        const payload = { 
            user: { id: usuario.id, rol: usuario.rol } 
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                token, 
                user: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } 
            });
        });
    } catch (err) {
        res.status(500).send("Error en el servidor");
    }
};

exports.deleteWorker = async (req, res) => {
    try {
        const worker = await Usuario.findById(req.params.id);
        if (!worker || worker.rol !== 'trabajador') {
            return res.status(404).json({ msg: "Trabajador no encontrado" });
        }
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ msg: "Trabajador eliminado correctamente" });
    } catch (err) {
        res.status(500).send("Error al eliminar");
    }
};