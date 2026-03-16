import React from 'react';

const ChatMessage = ({ msg }) => {
  const isAi = msg.sender === 'ai';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isAi ? 'flex-start' : 'flex-end',
      margin: '8px 0'
    }}>
      <div style={{
        backgroundColor: isAi ? '#f0f0f0' : '#2563eb',
        color: isAi ? '#333' : 'white',
        padding: '10px',
        borderRadius: '12px',
        maxWidth: '80%',
        fontSize: '14px'
      }}>
        {msg.text}
      </div>
    </div>
  );
};

export default ChatMessage;