const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
const Repuesto = require("../models/repuesto"); // <--- Importa tu modelo de MongoDB

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;

        // 1. BUSCAMOS LOS REPUESTOS EN LA BASE DE DATOS
        const productos = await Repuesto.find({}); 
        
        // 2. CREAMOS UN RESUMEN DE TEXTO PARA LA IA
        // Solo enviamos los datos necesarios para no gastar tokens
        const contextoInventario = productos.map(p => 
            `- ${p.nombre}: Marca ${p.marcaCarro}, Modelo ${p.modeloCarro}, Precio $${p.precioVenta}, Stock: ${p.stock}, Ubicación: ${p.ubicacionPasillo}`
        ).join('\n');

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Tu nombre es Luna. Eres la asistente de 'Auto-Repuestos San Francisco de Asís' en Ciudad Bolívar. 
                    TIENES ACCESO AL SIGUIENTE INVENTARIO REAL:
                    ${contextoInventario}
                    
                    Instrucciones:
                    - Si el cliente pregunta por un repuesto, revisa la lista de arriba.
                    - Si hay stock, dile el precio y el pasillo donde encontrarlo.
                    - Si no está en la lista, dile amablemente que no lo tienes por ahora pero que puedes consultar con los proveedores.
                    - Sé amable y usa un tono profesional pero cercano.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5, // Bajamos la temperatura para que sea más precisa con los datos
        });

        const reply = chatCompletion.choices[0]?.message?.content || "No pude procesar la respuesta.";
        res.json({ reply });

    } catch (error) {
        console.error("ERROR EN LUNA:", error.message);
        res.status(500).json({ error: "Error en la conexión con Luna" });
    }
});

module.exports = router;