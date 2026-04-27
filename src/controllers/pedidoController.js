const Pedido = require('../models/pedido');
const Repuesto = require('../models/repuesto');
const { registrarLog } = require('../services/auditoriaService');
const nodemailer = require('nodemailer');
const Venta = require('../models/venta');
const Delivery = require('../models/delivery'); 
const CompraCliente = require('../models/compraCliente');

// @desc    Crear un nuevo pedido (Checkout), integrar Delivery y estadísticas de Venta
const crearPedido = async (req, res) => {
    try {
        // 1. Extraemos los datos respetando la estructura de tu Checkout.js
        const { 
            items, 
            tasaCambio, 
            pago, 
            cliente, 
            total: totalManual,
            metodoPago: metodoPagoFront 
        } = req.body;

        // Fallback de seguridad para la tasa
        const tasa = parseFloat(tasaCambio) || 36.50;

        // Validaciones iniciales
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ msg: "El carrito está vacío" });
        }

        let totalCalculadoUSD = 0;
        const itemsProcesados = [];

        // 2. Procesamiento de items y validación de stock (Directo de DB)
        for (const item of items) {
            const repuesto = await Repuesto.findById(item.repuesto);
            
            if (!repuesto) {
                return res.status(404).json({ msg: `Repuesto no encontrado ID: ${item.repuesto}` });
            }
            
            if (repuesto.stock < item.cantidad) {
                return res.status(400).json({ msg: `Stock insuficiente para: ${repuesto.nombre}` });
            }

            const precioVenta = Number(repuesto.precioVenta || 0);
            const cantidadComprada = Number(item.cantidad || 0);

            totalCalculadoUSD += precioVenta * cantidadComprada;

            itemsProcesados.push({
                repuesto: item.repuesto,
                nombre: repuesto.nombre,
                cantidad: cantidadComprada,
                precioUnitario: precioVenta
            });
        }

        const totalFinalUSD = totalManual || Number(totalCalculadoUSD.toFixed(2));
        const usuarioId = (req.user && (req.user._id || req.user.id)) ? (req.user._id || req.user.id) : null;

        // 3. Creación del Pedido Sincronizado
        const nuevoPedido = new Pedido({
    nroOrden: `SF-${Date.now().toString().slice(-6)}`,
    usuario: usuarioId, // Mongoose aceptará null si el esquema lo permite
    cliente: {
        // Usamos el operador ?. y fallback para evitar que el backend explote si falta req.user
        nombre: cliente?.nombre || (req.user?.nombre) || "Cliente Invitado",
        cedula: cliente?.cedula || "N/A",
        email: cliente?.email || (req.user?.email) || "invitado@correo.com",
        telefono: cliente?.telefono || "N/A",
        direccion: cliente?.direccion || "N/A",
        puntoReferencia: cliente?.puntoReferencia || "N/A"
    },
            items: itemsProcesados,
            total: totalFinalUSD,
            totalUSD: totalFinalUSD, 
            tasaCambio: tasa,
            totalBS: Number((totalFinalUSD * tasa).toFixed(2)),
            metodoPago: metodoPagoFront || "Pago Móvil",
            pago: {
                referencia: pago?.referencia || "N/A",
                bancoOrigen: pago?.bancoOrigen || "N/A"
            },
            // Si hay dirección en el cliente, asumimos que es delivery
            metodoEntrega: (cliente?.direccion && cliente.direccion !== "N/A") ? 'delivery' : 'tienda',
            estado: 'Pendiente'
        });

        const pedidoGuardado = await nuevoPedido.save();

        // 4. Lógica de Delivery Automática
        if (nuevoPedido.metodoEntrega === 'delivery') {
            const nuevoDelivery = new Delivery({
                pedidoId: pedidoGuardado._id,
                cliente: {
                    nombre: pedidoGuardado.cliente.nombre,
                    telefono: pedidoGuardado.cliente.telefono,
                    direccion: pedidoGuardado.cliente.direccion,
                    referencia: pedidoGuardado.cliente.puntoReferencia
                },
                logistica: {
                    destinoCoords: req.body.ubicacion || "Ubicación por dirección",
                    estado: 'Pendiente'
                }
            });
            await nuevoDelivery.save();
        }

        // 5. Registro de Venta para estadísticas
        try {
            const nuevaVenta = new Venta({
                nroControl: `FAC-${Date.now().toString().slice(-6)}`,
                vendedor: usuarioId, 
                cliente: {
                    nombre: pedidoGuardado.cliente.nombre,
                    cedulaRif: pedidoGuardado.cliente.cedula
                },
                items: itemsProcesados.map(i => ({
                    repuestoId: i.repuesto,
                    nombreCapturado: i.nombre,
                    cantidad: i.cantidad,
                    precioUnitario: i.precioUnitario,
                    subtotal: Number((i.cantidad * i.precioUnitario).toFixed(2))
                })),
                total: totalFinalUSD,
                metodoPago: nuevoPedido.metodoPago,
                estado: 'Completada'
            });
            await nuevaVenta.save();
        } catch (vErr) { console.error("Error en Venta Stats:", vErr.message); }

        // 6. Registro en CompraCliente (Historial)
        try {
            const nuevaCompra = new CompraCliente({
                cliente: usuarioId,
                pedido: pedidoGuardado._id,
                total: totalFinalUSD,
                items: itemsProcesados
            });
            await nuevaCompra.save();
        } catch (cErr) { console.error("Error Historial Cliente:", cErr.message); }

        // 7. Descontar Stock
        for (const item of itemsProcesados) {
            await Repuesto.findByIdAndUpdate(item.repuesto, {
                $inc: { stock: -item.cantidad }
            });
        }

        // 8. Auditoría
        await registrarLog(usuarioId, 'COMPRA', 'PEDIDOS', `Orden ${pedidoGuardado.nroOrden} generada con éxito`);

        // 9. Email (Opcional)
        if (process.env.EMAIL_USER && pedidoGuardado.cliente.email) {
            enviarEmail(pedidoGuardado); 
        }

        res.status(201).json(pedidoGuardado);

    } catch (error) {
        console.error("❌ ERROR CRÍTICO EN PEDIDO:", error);
        res.status(500).json({ 
            msg: "Error al procesar la compra en San Francisco de Asís", 
            detalle: error.message 
        });
    }
};

const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedidoEliminado = await Pedido.findByIdAndDelete(id);

        if (!pedidoEliminado) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'No se encontró el pedido en San Francisco de Asís' 
            });
        }

        res.status(200).json({ 
            status: 'success', 
            message: 'Registro eliminado correctamente' 
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al intentar eliminar el registro' });
    }
};

const enviarEmail = async (pedido) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        await transporter.sendMail({
            from: `"Automotriz San Francisco de Asís" <${process.env.EMAIL_USER}>`,
            to: pedido.cliente.email,
            subject: `Confirmación de Pedido #${pedido.nroOrden}`,
            html: `<h3>Hola ${pedido.cliente.nombre}</h3><p>Recibimos tu pedido <strong>#${pedido.nroOrden}</strong> correctamente.</p>`
        });
    } catch (err) { console.error("Email Error:", err.message); }
};

const obtenerMisPedidos = async (req, res) => {
    try {
        // LOGS PARA DEPURAR (Míralos en la terminal del backend)
        console.log("--- Intento de obtener pedidos ---");
        
        if (!req.user) {
            console.log("❌ Error: req.user no existe. El middleware falló.");
            return res.status(401).json({ msg: "No autorizado" });
        }

        console.log("ID del usuario desde el token:", req.user._id);

        // BUSQUEDA: Asegúrate que el campo se llame 'usuario' en tu modelo
        const pedidos = await Pedido.find({ usuario: req.user._id }).sort({ createdAt: -1 });
        
        console.log(`✅ Pedidos encontrados: ${pedidos.length}`);
        
        res.json(pedidos);
    } catch (error) {
        console.error("❌ ERROR REAL EN EL BACKEND:", error.message);
        res.status(500).json({ 
            msg: "Error interno del servidor", 
            error: error.message 
        });
    }
};

const actualizarEstadoPedido = async (req, res) => {
    try {
        const { estado } = req.body;
        const { id } = req.params;
        const pedido = await Pedido.findById(id);

        if (!pedido) return res.status(404).json({ msg: "Pedido no encontrado" });

        if (estado === 'Cancelado' && pedido.estado !== 'Cancelado') {
            for (const item of pedido.items) {
                await Repuesto.findByIdAndUpdate(item.repuesto, { $inc: { stock: item.cantidad } });
            }
        }

        pedido.estado = estado;
        const pedidoActualizado = await pedido.save();

        await registrarLog(req.user.id || req.user._id, 'ACTUALIZACION', 'PEDIDOS', `Estado cambiado a ${estado} para orden ${pedido.nroOrden}`);

        res.json({ msg: `Pedido actualizado a ${estado}`, pedido: pedidoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar estado", detalle: error.message });
    }
};

const obtenerTodosLosPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find({})
            .populate('usuario', 'nombre email') 
            .sort({ createdAt: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la lista de ventas", detalle: error.message });
    }
};

const getMisCompras = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const misCompras = await CompraCliente.find({ cliente: userId }).sort({ fecha: -1 });
        res.status(200).json(misCompras);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el historial de compras" });
    }
};

module.exports = {
    crearPedido,
    obtenerMisPedidos,
    actualizarEstadoPedido,
    obtenerTodosLosPedidos,
    eliminarPedido,
    getMisCompras
};