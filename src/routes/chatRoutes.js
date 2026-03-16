const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");

// Inicializamos Groq con tu API Key del .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "No se recibió un mensaje" });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Tu nombre es Luna. Eres la asistente virtual experta de 'Auto-Repuestos San Francisco de Asís' en Ciudad Bolívar. Tu objetivo es ayudar a los clientes a encontrar repuestos automotrices y ser muy amable."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = chatCompletion.choices[0]?.message?.content || "No pude procesar la respuesta.";
        
        res.json({ reply: reply });

    } catch (error) {
        console.error("ERROR EN GROQ:", error.message);
        res.status(500).json({ 
            error: "Error en la conexión con Luna (Groq)",
            details: error.message 
        });
    }
});

module.exports = router;