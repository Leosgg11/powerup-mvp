import React, { useEffect, useState } from 'react';

const ProductList = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al obtener productos:', err));
  }, []);

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {productos.map(producto => (
          <li key={producto._id}>
            <strong>{producto.nombre}</strong> - ${producto.precio} - Stock: {producto.stock}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
