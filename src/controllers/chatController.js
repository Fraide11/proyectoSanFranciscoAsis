const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatear = async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Instrucciones de sistema para que no se salga del tema automotriz
    const context = `Eres el asistente experto de 'Auto-Repuestos San Francisco de Asís'. 
    Tu objetivo es ayudar a los clientes a encontrar repuestos y dar consejos mecánicos breves. 
    Sé amable y profesional. Si no sabes algo, invita al cliente a visitar la tienda física.`;

    const result = await model.generateContent(`${context}\n\nCliente: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Error en Gemini:", error);
    res.status(500).json({ reply: "Lo siento, mi sistema de diagnóstico falló. Intenta de nuevo." });
  }
};

module.exports = { chatear };