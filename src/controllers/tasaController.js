const Tasa = require('../models/tasa');
const axios = require('axios');

// 1. Obtener la tasa para el Frontend
exports.getTasa = async (req, res) => {
    try {
        const tasa = await Tasa.findOne().sort({ fechaActualizacion: -1 });
        console.log("🔍 Buscando tasa en DB...", tasa); // Mira esto en la terminal
        
        if (!tasa) {
            return res.status(404).json({ msg: "No hay datos en la tabla tasas" });
        }
        
        res.json(tasa);
    } catch (error) {
        res.status(500).json({ msg: "Error de servidor" });
    }
};

// 2. Lógica de actualización (Unificada)
exports.updateTasa = async (req, res) => {
    try {
        // 1. Obtenemos el valor de la API (puedes usar DolarApi o la que prefieras)
        const response = await axios.get('https://ve.dolarapi.com/v1/dolares/oficial');
        const valorOficial = response.data.promedio;

        // 2. Creamos el registro
        const nuevaTasa = new Tasa({
            valor: valorOficial,
            fechaActualizacion: new Date()
        });

        await nuevaTasa.save();
        console.log(`✅ Tasa actualizada automáticamente: ${valorOficial} Bs.`);

        // 3. SOLO RESPONDEMOS SI VIENE DE UNA RUTA (si res existe)
        if (res) {
            return res.json({ msg: "Tasa actualizada", valor: valorOficial });
        }
    } catch (error) {
        console.error("❌ Error actualizando tasa:", error.message);
        
        // SOLO RESPONDEMOS ERROR SI VIENE DE UNA RUTA
        if (res) {
            return res.status(500).json({ msg: "Error en la actualización" });
        }
    }
};