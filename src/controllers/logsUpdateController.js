const LogUpdate = require('../models/logsUpdate');

// @desc    Obtener todo el historial de cambios
exports.obtenerHistorialCompleto = async (req, res) => {
  try {
    const logs = await LogUpdate.find()
      .populate('repuestoId', 'nombre codigo') 
      .populate('usuarioId', 'nombre apellido') 
      .sort({ fecha: -1 });
    
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error al recuperar el historial", error });
  }
};

// @desc    Obtener historial de un repuesto específico
// ESTA ES LA QUE FALTABA Y HACÍA CRASHEAR EL SERVER
exports.obtenerLogsPorRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await LogUpdate.find({ repuestoId: id })
      .populate('usuarioId', 'nombre apellido')
      .sort({ fecha: -1 });
    
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error al recuperar los logs del repuesto", error });
  }
};