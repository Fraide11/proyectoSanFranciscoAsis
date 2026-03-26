import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. Carga inicial segura desde localStorage
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart_san_francisco');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error("Error al leer el carrito:", error);
            return [];
        }
    });

    // 2. Persistencia automática
    useEffect(() => {
        localStorage.setItem('cart_san_francisco', JSON.stringify(cart));
    }, [cart]);

    // 3. Añadir (o incrementar) con validación de stock
    const addToCart = (producto) => {
        setCart((prev) => {
            const exists = prev.find(item => item._id === producto._id);
            if (exists) {
                // Si ya existe, aumentamos cantidad
                return prev.map(item => 
                    item._id === producto._id 
                    ? { ...item, cantidad: item.cantidad + 1 } 
                    : item
                );
            }
            // Si es nuevo, usamos 'precioVenta' para ser consistentes con tu DB
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    // 4. Quitar una unidad (Disminuir cantidad)
    const decreaseQuantity = (id) => {
        setCart((prev) => {
            const item = prev.find(i => i._id === id);
            if (item.cantidad > 1) {
                return prev.map(i => i._id === id ? { ...i, cantidad: i.cantidad - 1 } : i);
            }
            return prev.filter(i => i._id !== id); // Si llega a 0, se borra
        });
    };

    // 5. Eliminar producto completo
    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const clearCart = () => setCart([]);

    // 6. Cálculo del Total (Cambiado a 'precioVenta')
    const total = cart.reduce((acc, item) => {
        const precio = item.precioVenta || 0;
        return acc + (precio * item.cantidad);
    }, 0);

    // 7. Contador de items totales (para la burbuja roja del icono del carrito)
    const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            decreaseQuantity, 
            removeFromCart, 
            clearCart, 
            total,
            cartCount 
        }}>
            {children}
        </CartContext.Provider>
    );
};