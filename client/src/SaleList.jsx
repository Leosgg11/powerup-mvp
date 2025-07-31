import React, { useEffect, useState } from 'react';

const SaleList = ({ refresh }) => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sales')
      .then(res => res.json())
      .then(data => setSales(data));
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [refresh]);

  // Helper para obtener el nombre del producto por ID
  const getProductName = id => {
    const prod = products.find(p => p._id === id);
    return prod ? prod.name : 'Producto eliminado';
  };

  const handleDeleteSale = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar esta venta?')) return;
    await fetch(`http://localhost:5000/api/sales/${id}`, { method: 'DELETE' });
    setSales(sales.filter(s => s._id !== id));
  };

  return (
    <div>
      <h2>Ventas</h2>
      <ul style={{ padding: 0 }}>
        {sales.map(sale => (
          <li
            key={sale._id}
            style={{
              background: '#e3f2fd',
              marginBottom: 8,
              padding: '10px 16px',
              borderRadius: 4,
              borderLeft: '4px solid #1976d2'
            }}
          >
            <div>
              <strong>Cliente:</strong> {sale.client} <br />
              <strong>Total:</strong> ${sale.total}
            </div>
            <div>
              <strong>Productos:</strong>
              <ul>
                {sale.products.map((p, idx) => (
                  <li key={idx}>
                    {getProductName(p.productId)} x{p.quantity} (${p.price} c/u)
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Fecha:</strong> {sale.createdAt ? new Date(sale.createdAt).toLocaleString() : 'Sin fecha'}
            </div>
            <button
              style={{
                background: '#e57373',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '4px 8px',
                cursor: 'pointer',
                marginTop: 8
              }}
              onClick={() => handleDeleteSale(sale._id)}
            >
              Eliminar venta
            </button>
          </li>
        ))}
      </ul>
      {sales.length === 0 && <div>No hay ventas registradas.</div>}
    </div>
  );
};

export default SaleList;