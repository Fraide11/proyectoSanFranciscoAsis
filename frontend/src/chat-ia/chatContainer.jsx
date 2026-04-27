import React, { useState } from 'react';
import ChatMessage from './chatMessage'; 
import { sendMessageToAI } from './chatService';

const ChatContainer = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy Luna, asistente de San Francisco de Asís. ¿En qué puedo ayudarte?", sender: 'ai' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      // Llamamos al nuevo servicio de Groq
      const reply = await sendMessageToAI(currentInput);
      setMessages(prev => [...prev, { text: reply, sender: 'ai' }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Luna está fuera de línea por ahora.", sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
     
      

 
  width: '100%', // Para que llene el contenedor flotante que hicimos en App.jsx
  height: '100%', 
  backgroundColor: '#1a1a2e', // Fondo oscuro como tu app
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Arial, sans-serif',
  color: 'white'
  
    }}>
      <div style={{ padding: '15px', background: '#2563eb', color: 'white', borderRadius: '10px 10px 0 0', fontWeight: 'bold' }}>
        Chat San Francisco AI
      </div>
      
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <ChatMessage key={i} msg={m} />
        ))}
        {loading && (
          <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginLeft: '10px' }}>
            Luna está escribiendo...
          </p>
        )}
      </div>

      <div style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex' }}>
        <input 
          style={{ flex: 1, border: '1px solid #ddd', padding: '8px', borderRadius: '5px', outline: 'none' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe aquí..."
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          style={{ 
            marginLeft: '5px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            border: 'none',
            background: 'none',
            fontSize: '18px',
            color: '#2563eb'
          }}
          disabled={loading}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatContainer;