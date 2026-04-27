const Delivery = require('../models/delivery');

// --- CREACIÓN ---

exports.crearDelivery = async (req, res) => {
  try {
    console.log("📥 Datos recibidos para logística:", req.body);
    const { pedidoId, logistica } = req.body;

    if (!pedidoId) {
      return res.status(400).json({ error: "El ID del pedido es obligatorio para la logística" });
    }

    const nuevoDelivery = new Delivery({
      pedidoId: pedidoId,
      logistica: {
        destinoCoords: logistica?.destinoCoords || "Ubicación pendiente",
        tiempoEstimado: logistica?.tiempoEstimado || "Por calcular",
        distancia: logistica?.distancia || "0 km"
      },
      estado: 'Pendiente'
    });

    const resultado = await nuevoDelivery.save();
    console.log("💾 Registro creado con éxito");
    res.status(201).json(resultado);

  } catch (error) {
    console.error("❌ Error al insertar:", error);
    res.status(500).json({ error: "Error interno", detalle: error.message });
  }
};

// --- CONSULTAS ---

exports.obtenerDeliveries = async (req, res) => {
  try {
    // Forzamos el populate indicando explícitamente el path y el modelo
    const envios = await Delivery.find().populate({
        path: 'pedidoId',
        model: 'Pedido' // <-- Forzamos a que busque en el modelo 'Pedido'
    });
    
    // Log para verificar en la consola del servidor si el objeto pedidoId viene lleno
    console.log("REVISIÓN BACKEND:", envios[0]); 
    
    res.json(envios);
  } catch (error) {
    console.error("Error al obtener envíos:", error);
    res.status(500).json({ mensaje: "Error al obtener envíos", error: error.message });
  }
};
// --- ACTUALIZACIONES DE ESTADO Y ASIGNACIÓN ---

exports.actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;
  try {
    const delivery = await Delivery.findById(id);
    if (!delivery) return res.status(404).json({ mensaje: "No encontrado" });

    delivery.estado = nuevoEstado;
    delivery.historial.push({ estado: nuevoEstado, fecha: Date.now() });
    await delivery.save();
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar", error });
  }
};

exports.asignarRepartidor = async (req, res) => {
  const { id } = req.params;
  const { repartidorId } = req.body;

  try {
    const deliveryAsignado = await Delivery.findByIdAndUpdate(
      id,
      {
        repartidorId,
        estado: 'Asignado',
        fechaSalida: Date.now()
      },
      { new: true }
    ).populate('repartidorId', 'nombre apellido');

    if (!deliveryAsignado) {
      return res.status(404).json({ mensaje: "No se encontró el registro de delivery" });
    }

    res.json({ mensaje: "Repartidor asignado con éxito", delivery: deliveryAsignado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al asignar repartidor", error });
  }
};

// --- ACTUALIZACIONES LOGÍSTICAS ---

exports.actualizarTiempoYRuta = async (req, res) => {
  const { id } = req.params;
  const { tiempoEstimado, destinoCoords } = req.body;

  try {
    const deliveryActualizado = await Delivery.findByIdAndUpdate(
      id,
      {
        'logistica.tiempoEstimado': tiempoEstimado,
        'logistica.destinoCoords': destinoCoords
      },
      { new: true }
    );
    res.json(deliveryActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar logística", error });
  }
};