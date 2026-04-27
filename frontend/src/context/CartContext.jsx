// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. ESTADO DEL CARRITO (Con persistencia en LocalStorage)
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart_san_francisco');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error al leer el carrito:", error);
            return [];
        }
    });

    // 2. ESTADOS PARA LA TASA
    const [tasaCambio, setTasaCambio] = useState(36.50); // Fallback inicial
    const [loadingTasa, setLoadingTasa] = useState(true);

    // 3. GUARDADO AUTOMÁTICO
    useEffect(() => {
        localStorage.setItem('cart_san_francisco', JSON.stringify(cart));
    }, [cart]);

    // 4. FUNCIÓN PARA OBTENER LA TASA DE LA DB
    const obtenerTasaDeDB = async () => {
        try {
            setLoadingTasa(true);
            const res = await axios.get('http://localhost:10000/api/tasa');
            if (res.data && res.data.valor) {
                setTasaCambio(Number(res.data.valor));
                console.log("📈 Tasa sincronizada desde DB:", res.data.valor);
            }
        } catch (error) {
            console.error("⚠️ Usando tasa de respaldo:", error.message);
        } finally {
            setLoadingTasa(false);
        }
    };

    useEffect(() => {
        obtenerTasaDeDB();
    }, []);

    // 5. LÓGICA DEL CARRITO (Funciones que ya tenías)
    const addToCart = (producto) => {
        setCart((prev) => {
            const exists = prev.find(item => item._id === producto._id);
            if (exists) {
                return prev.map(item => 
                    item._id === producto._id 
                    ? { ...item, cantidad: item.cantidad + 1 } 
                    : item
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const decreaseQuantity = (id) => {
        setCart((prev) => {
            const item = prev.find(i => i._id === id);
            if (item && item.cantidad > 1) {
                return prev.map(i => i._id === id ? { ...i, cantidad: i.cantidad - 1 } : i);
            }
            return prev.filter(i => i._id !== id);
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    // 6. CÁLCULOS OPTIMIZADOS (useMemo)
    const { totalUSD, totalBS, cartCount } = useMemo(() => {
        const usd = cart.reduce((acc, item) => acc + (item.precioVenta * item.cantidad), 0);
        const count = cart.reduce((acc, item) => acc + item.cantidad, 0);
        
        return {
            totalUSD: usd,
            totalBS: (usd * tasaCambio).toFixed(2),
            cartCount: count
        };
    }, [cart, tasaCambio]);

    // 7. EXPORTACIÓN DE VALORES
    return (
        <CartContext.Provider value={{ 
            cart, 
            setCart,
            addToCart, 
            decreaseQuantity, 
            removeFromCart, 
            clearCart, 
            total: totalUSD, 
            totalUSD,        
            totalBS,         
            tasaCambio,
            cartCount,
            loadingTasa,
            obtenerTasaDeDB
        }}>
            {children}
        </CartContext.Provider>
    );
};