import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Gift, Music } from 'lucide-react';

const VictoriaLovePage = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [showSurprise, setShowSurprise] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    // Generar corazones flotantes
    const interval = setInterval(() => {
      if (floatingHearts.length < 15) {
        const newHeart = {
          id: Date.now(),
          left: Math.random() * 100,
          duration: Math.random() * 5 + 3,
          size: Math.random() * 20 + 15
        };
        setFloatingHearts(prev => [...prev, newHeart]);
        
        setTimeout(() => {
          setFloatingHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
        }, newHeart.duration * 1000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [floatingHearts.length]);

  const handleSurprise = () => {
    setShowSurprise(true);
    setTimeout(() => setShowSurprise(false), 5000);
  };

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
    // Aquí podrías añadir un audio real si lo deseas
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-purple-100 relative overflow-hidden">
      {/* Corazones flotantes */}
      {floatingHearts.map(heart => (
        <div
          key={heart.id}
          className="absolute animate-float pointer-events-none"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}px`
          }}
        >
          ❤️
        </div>
      ))}

      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        {/* Header con nombre */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-600 via-red-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Para Victoria ❤️
          </h1>
          <div className="flex justify-center gap-2 mb-6">
            <Heart className="text-pink-500 animate-pulse" size={32} fill="currentColor" />
            <Sparkles className="text-yellow-500 animate-spin" size={32} />
            <Heart className="text-red-500 animate-pulse" size={32} fill="currentColor" />
          </div>
        </div>

        {/* Mensaje principal */}
        <div className="max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 transform transition-all hover:scale-105 duration-300">
          <p className="text-xl md:text-2xl text-gray-800 leading-relaxed text-center font-medium">
            Victoria, cada día a tu lado es un regalo del universo. 
            Tu sonrisa ilumina mi mundo y tu corazón hace que todo sea más bonito. 
            Eres mi persona favorita en este planeta y en cualquier galaxia. 
            <span className="block mt-4 text-pink-600">Te amo infinitamente ✨</span>
          </p>
        </div>

        {/* Botón interactivo */}
        <button
          onClick={() => setShowMessage(!showMessage)}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-6 flex items-center gap-2"
        >
          <Heart size={20} fill="white" />
          {showMessage ? "Ocultar mensaje" : "Toca para una sorpresa"}
          <Heart size={20} fill="white" />
        </button>

        {/* Mensaje oculto */}
        {showMessage && (
          <div className="max-w-md bg-white rounded-xl shadow-xl p-6 mb-6 animate-slide-up">
            <p className="text-gray-700 text-center">
              Eres la razón por la que creo en el amor verdadero. Gracias por existir y por elegirme cada día. 
              Contigo, Victoria, he encontrado mi lugar en el mundo. 💖
            </p>
          </div>
        )}

        {/* Botón de sorpresa */}
        <button
          onClick={handleSurprise}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <Gift size={20} />
          Sorpresa especial
        </button>

        {/* Alerta de sorpresa */}
        {showSurprise && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce-in z-50">
            <p className="font-bold">¡Te amo, Victoria! ❤️</p>
          </div>
        )}

        {/* Contador de corazones */}
        <div className="mt-12 text-center text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <Heart size={16} fill="pink" />
            {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            <Heart size={16} fill="pink" />
          </p>
        </div>
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
          position: absolute;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VictoriaLovePage;
