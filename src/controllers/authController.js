const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const { registrarLog } = require('../services/auditoriaService');

// @desc    Registrar un Trabajador (Vendedor)
exports.registerWorker = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: "El correo ya está registrado en el sistema" });
        }

        usuario = new Usuario({
            nombre,
            email,
            password,
            rol: 'vendedor'
        });

        await usuario.save();

        // AUDITORÍA: Registro de nuevo personal
        await registrarLog(
            req.user?.id, // ID del Admin que lo registra
            'REGISTRO', 
            'USUARIOS', 
            `Registró al trabajador: ${nombre} (${email})`
        );

        res.status(201).json({ 
            msg: "Trabajador registrado exitosamente", 
            usuario: { id: usuario._id, nombre, email, rol: usuario.rol } 
        });

    } catch (err) {
        console.error("Error en Registro:", err.message);
        res.status(500).json({ msg: "Error al registrar el trabajador en la base de datos" });
    }
};

// @desc    Login de usuario
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Buscamos incluyendo el password oculto
        let usuario = await Usuario.findOne({ email }).select('+password');
        
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ msg: "Credenciales inválidas o cuenta suspendida" });
        }

        const isMatch = await usuario.compararPassword(password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        const payload = { 
            user: { id: usuario.id, rol: usuario.rol } 
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'secret_san_francisco_2026', 
            { expiresIn: '8h' }, 
            async (err, token) => {
                if (err) throw err;

                // AUDITORÍA: Registro de acceso exitoso
                await registrarLog(usuario.id, 'LOGIN', 'AUTH', `Acceso al sistema desde IP: ${req.ip}`);

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
        console.error("Error en Login:", err.message);
        res.status(500).json({ msg: "Error de conexión con el servidor" });
    }
};

// @desc    Eliminar un Trabajador
exports.deleteWorker = async (req, res) => {
    try {
        const worker = await Usuario.findById(req.params.id);
        
        if (!worker || worker.rol === 'admin') {
            return res.status(403).json({ msg: "Operación no permitida o trabajador inexistente" });
        }

        const nombreEliminado = worker.nombre;
        await Usuario.findByIdAndDelete(req.params.id);

        // AUDITORÍA: Registro de baja de personal
        await registrarLog(
            req.user.id, 
            'ELIMINAR', 
            'USUARIOS', 
            `Eliminó la cuenta del trabajador: ${nombreEliminado}`
        );

        res.json({ msg: `El trabajador ${nombreEliminado} ha sido eliminado` });
    } catch (err) {
        console.error("Error en Delete Worker:", err.message);
        res.status(500).json({ msg: "Error al procesar la baja" });
    }
};