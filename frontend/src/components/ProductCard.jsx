import React from 'react';

const ProductCard = ({ item, onOpenDetails, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {/* Si no tienes imagen, un icono de repuesto genérico */}
        <img 
          src={item.imagen || 'https://via.placeholder.com/200x150?text=Repuesto'} 
          alt={item.nombre} 
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{item.nombre}</h3>
        <p className="product-brand">{item.marca} • {item.modelo}</p>
        <div className="product-price-row">
          <span className="price">${item.precio}</span>
          <span className="stock-label">{item.stock > 0 ? 'Disponible' : 'Agotado'}</span>
        </div>
      </div>

      <div className="product-actions">
        <button 
          className="btn-add" 
          onClick={() => onAddToCart(item)}
          disabled={item.stock <= 0}
        >
          🛒 Añadir
        </button>
        
        <button 
          className="btn-details-link" 
          onClick={() => onOpenDetails(item)}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default ProductCard;