const Usuario = require('../models/usuario'); // Asegúrate que el nombre del archivo coincida (Mayúscula/minúscula)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Registrar un Trabajador (Vendedor)
// @route   POST /api/auth/register-worker
exports.registerWorker = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // 1. Verificar si ya existe
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }

        // 2. Crear nuevo trabajador 
        // NOTA: No encriptamos aquí porque el modelo ya tiene el .pre('save')
        usuario = new Usuario({
            nombre,
            email,
            password,
            rol: 'vendedor' // Usamos 'vendedor' que es el que pusimos en el ENUM del modelo
        });

        await usuario.save();

        res.json({ 
            msg: "Trabajador registrado exitosamente", 
            usuario: { nombre, email, rol: usuario.rol } 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al registrar trabajador");
    }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Buscar usuario y traer el password (select +password si lo pusiste oculto)
        let usuario = await Usuario.findOne({ email }).select('+password');
        if (!usuario) {
            return res.status(400).json({ msg: "Credenciales inválidas" });
        }

        // 2. Comparar usando el método que definimos en el modelo
        const isMatch = await usuario.compararPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Credenciales inválidas" });
        }

        // 3. Crear JWT incluyendo el ROL
        const payload = { 
            user: { id: usuario.id, rol: usuario.rol } 
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'secret_para_desarrollo_123', 
            { expiresIn: '8h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: { 
                        id: usuario.id, 
                        nombre: usuario.nombre, 
                        rol: usuario.rol 
                    } 
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el servidor");
    }
};

// @desc    Eliminar un Trabajador
// @route   DELETE /api/auth/worker/:id
exports.deleteWorker = async (req, res) => {
    try {
        const worker = await Usuario.findById(req.params.id);
        
        // Verificamos que sea un trabajador/vendedor y no un admin
        if (!worker || worker.rol === 'admin') {
            return res.status(404).json({ msg: "Trabajador no encontrado o no autorizado" });
        }

        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ msg: "Trabajador eliminado correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al eliminar");
    }
};