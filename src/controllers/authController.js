const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const { registrarLog } = require('../services/auditoriaService');
const { enviarCorreoRecuperacion } = require('../services/emailServices');
const crypto = require('crypto'); // Viene nativo en Node

/**
 * 🛠️ FUNCIONES AUXILIARES
 */
const generarToken = (usuario) => {
    return jwt.sign(
        { user: { id: usuario.id, rol: usuario.rol } },
        process.env.JWT_SECRET || 'secret_san_francisco_2026',
        { expiresIn: '8h' }
    );
};

// @desc    Registrar un Cliente (Público - Desde Login o Carrito)
const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // 1. Validación de campos
        if (!nombre || !email || !password) {
            return res.status(400).json({ msg: "Nombre, correo y clave son obligatorios" });
        }

        // 2. Verificar si el usuario ya existe
        let usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ msg: "El correo ya está registrado" });
        }

        // 3. Crear el usuario (el modelo se encarga de encriptar el password)
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password,
            rol: 'cliente' // Rol por defecto para compras
        });

        await nuevoUsuario.save();

        // 4. Generar Token JWT inmediatamente para permanencia
        const token = generarToken(nuevoUsuario);

        // 5. Auditoría del nuevo registro
        await registrarLog(nuevoUsuario.id, 'REGISTRO', 'AUTH', `Nuevo cliente registrado: ${nombre}`);

        res.status(201).json({
            msg: "Usuario registrado con éxito",
            token,
            user: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                rol: nuevoUsuario.rol
            }
        });
    } catch (error) {
        console.error("Error en Register:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Registrar un Trabajador (Solo Admin)
const registerWorker = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        if (!nombre || !email || !password) {
            return res.status(400).json({ msg: "Por favor, complete todos los campos" });
        }

        let usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ msg: "El correo ya está registrado en el sistema" });
        }

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password,
            rol: 'trabajador'
        });

        await nuevoUsuario.save();

        // AUDITORÍA: Usamos req.user.id (quien registra es un admin logueado)
        if (req.user) {
            await registrarLog(req.user.id, 'REGISTRO_TRABAJADOR', 'AUTH', `Admin registró al trabajador: ${nombre}`);
        }

        res.status(201).json({ 
            msg: "Trabajador registrado exitosamente", 
            usuario: { id: nuevoUsuario._id, nombre, email, rol: nuevoUsuario.rol } 
        });

    } catch (err) {
        console.error("Error en Registro Worker:", err.message);
        res.status(500).json({ msg: "Error al registrar el trabajador" });
    }
};

// @desc    Login de usuario (Email o Nombre)
const login = async (req, res) => {
    const { email: identificador, password } = req.body; 
    
    try {
        let usuario = await Usuario.findOne({
            $or: [
                { email: identificador },
                { nombre: identificador }
            ]
        }).select('+password +activo');
        
        if (!usuario) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        if (usuario.activo === false) {
            return res.status(401).json({ msg: "Cuenta suspendida. Contacte al administrador." });
        }

        const isMatch = await usuario.compararPassword(password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        const token = generarToken(usuario);

        await registrarLog(usuario.id, 'LOGIN', 'AUTH', `Acceso exitoso - Usuario: ${usuario.nombre}`);

        res.json({ 
            token, 
            user: { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                rol: usuario.rol 
            } 
        });
    } catch (err) {
        console.error("Error en Login:", err.message);
        res.status(500).json({ msg: "Error de servidor al intentar iniciar sesión" });
    }
};




// authController.js - Función de actualización de perfil
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // 1. Solo permitimos actualizar estos campos
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // 2. Lógica de Password con encriptación
      if (req.body.password) {
        // El hashing se suele manejar en el modelo (pre-save hook), 
        // pero si no lo tienes, aquí aplicarías: 
        // user.password = await bcrypt.hash(req.body.password, 10);
        user.password = req.body.password; 
      }

      // IMPORTANTE: No tocamos user.role, se queda como está en la DB.

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role, // Devolvemos el rol original por consistencia
        token: generateToken(updatedUser._id), // Opcional: refrescar token
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};


// ... (recuperacion de contra)
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    // 📢 ESTO TIENE QUE SALIR SÍ O SÍ
    console.log(">>>> [DEBUG] Iniciando forgotPassword para:", email);

    try {
        const usuario = await Usuario.findOne({ email });
        console.log(">>>> [DEBUG] Resultado búsqueda usuario:", usuario ? "Encontrado" : "No existe");

        if (!usuario) {
            return res.status(404).json({ msg: 'No existe un usuario con ese correo' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        usuario.resetPasswordToken = token;
        usuario.resetPasswordExpires = Date.now() + 3600000;

        console.log(">>>> [DEBUG] Intentando guardar usuario con token...");
        await usuario.save();
        console.log(">>>> [DEBUG] Usuario guardado con éxito");

        console.log(">>>> [DEBUG] Intentando enviar correo...");
        // Temporalmente comenta la línea del correo si sospechas de ella
        await enviarCorreoRecuperacion(usuario.email, usuario.nombre, token);
        console.log(">>>> [DEBUG] Correo enviado");

        res.json({ msg: 'Se ha enviado un correo de recuperación' });

    } catch (error) {
        // 🚨 SI HAY UN ERROR, ESTO LO VA A GRITAR EN LA TERMINAL
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log("🚨 ERROR DETECTADO:", error);
        console.log("🚨 MENSAJE:", error.message);
        console.log("🚨 STACK:", error.stack);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        
        if (!res.headersSent) {
            res.status(500).json({ msg: 'Error interno', error: error.message });
        }
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // 🔍 Depuración inmediata
    console.log("--- PROCESANDO RESET PASSWORD ---");
    console.log("Token recibido:", token);
    console.log("Hora servidor:", new Date().toLocaleString());

    try {
        const usuario = await Usuario.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            console.log("❌ Token no encontrado o expirado en DB");
            try {
                await registrarLog(null, 'FALLO_RESET', 'AUTH', `Token inválido: ${token}`);
            } catch (e) {
                console.log("Error silencioso en auditoría");
            }
            return res.status(400).json({ msg: 'El token es inválido o ha expirado' });
        }

        // Si lo encuentra, actualizamos
        usuario.password = password; 
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;

        await usuario.save();
        console.log("✅ Contraseña actualizada para:", usuario.email);

        await registrarLog(usuario._id, 'RESTABLECER', 'AUTH', 'Éxito en cambio de clave');

        res.json({ msg: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error("🚨 Error crítico en resetPassword:", error);
        res.status(500).json({ msg: 'Error de servidor' });
    }
};



// @desc    Eliminar un Trabajador
const deleteWorker = async (req, res) => {
    try {
        const worker = await Usuario.findById(req.params.id);
        
        if (!worker) {
            return res.status(404).json({ msg: "Trabajador no encontrado" });
        }

        if (worker.rol === 'admin') {
            return res.status(403).json({ msg: "No se puede eliminar una cuenta de administrador" });
        }

        const nombreEliminado = worker.nombre;
        await Usuario.findByIdAndDelete(req.params.id);

        if (req.user) {
            await registrarLog(
                req.user.id, 
                'ELIMINAR', 
                'USUARIOS', 
                `Eliminó la cuenta del trabajador: ${nombreEliminado}`
            );
        }

        res.json({ msg: `El trabajador ${nombreEliminado} ha sido eliminado correctamente` });
    } catch (err) {
        console.error("Error en Delete Worker:", err.message);
        res.status(500).json({ msg: "Error al procesar la baja del usuario" });
    }
};




module.exports = {
    login,
    register,
    registerWorker,
    deleteWorker,
    forgotPassword,
    resetPassword,
    updateUserProfile
};