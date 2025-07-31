import React, { useState, useEffect } from 'react';

const SaleForm = ({ onSaleAdded }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [client, setClient] = useState('');
  const [message, setMessage] = useState('');
  const [saleProducts, setSaleProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Agregar producto a la venta
  const handleAddProduct = () => {
    const producto = products.find(p => p._id === selectedProduct);
    if (!producto) return;
    if (Number(quantity) < 1) return;
    if (Number(quantity) > producto.stock) {
      setMessage(`Stock insuficiente para ${producto.name}.`);
      return;
    }
    // Verifica si ya está en la lista
    const idx = saleProducts.findIndex(p => p.productId === selectedProduct);
    if (idx >= 0) {
      // Suma la cantidad si ya existe
      const nuevaLista = [...saleProducts];
      const nuevaCantidad = nuevaLista[idx].quantity + Number(quantity);
      if (nuevaCantidad > producto.stock) {
        setMessage(`Stock insuficiente para ${producto.name}.`);
        return;
      }
      nuevaLista[idx].quantity = nuevaCantidad;
      setSaleProducts(nuevaLista);
    } else {
      setSaleProducts([
        ...saleProducts,
        {
          productId: selectedProduct,
          name: producto.name,
          quantity: Number(quantity),
          price: producto.price,
          stock: producto.stock
        }
      ]);
    }
    setSelectedProduct('');
    setQuantity(1);
    setMessage('');
  };

  // Eliminar producto de la venta
  const handleRemoveProduct = idx => {
    setSaleProducts(saleProducts.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!client || saleProducts.length === 0) {
      setMessage('Completa todos los campos y agrega al menos un producto.');
      return;
    }
    // Validar stock antes de enviar
    for (const p of saleProducts) {
      const prod = products.find(prod => prod._id === p.productId);
      if (prod && p.quantity > prod.stock) {
        setMessage(`Stock insuficiente para ${prod.name}.`);
        return;
      }
    }
    const sale = {
      client,
      products: saleProducts.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
        price: p.price
      }))
    };
    const res = await fetch('http://localhost:5000/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale)
    });
    if (res.ok) {
      setMessage('Venta registrada correctamente.');
      setClient('');
      setSaleProducts([]);
      if (onSaleAdded) onSaleAdded();
    } else {
      const error = await res.json();
      setMessage(error.error || 'Error al registrar venta.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="client"
        placeholder="Cliente"
        value={client}
        onChange={e => setClient(e.target.value)}
        required
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <select
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
          required
        >
          <option value="">Selecciona un producto</option>
          {products.filter(p => p.stock > 0).map(p => (
            <option key={p._id} value={p._id}>
              {p.name} (Stock: {p.stock})
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          placeholder="Cantidad"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          required
        />
        <button type="button" onClick={handleAddProduct}>
          Agregar
        </button>
      </div>
      {selectedProduct && (
        <div style={{ color: '#1976d2', marginBottom: 8 }}>
          Stock disponible: {products.find(p => p._id === selectedProduct)?.stock}
        </div>
      )}
      <ul style={{ padding: 0 }}>
        {saleProducts.map((p, idx) => (
          <li
            key={idx}
            style={{
              background: '#f1f8e9',
              marginBottom: 8,
              padding: '8px 12px',
              borderRadius: 4,
              borderLeft: '4px solid #1976d2',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>
              <strong>{p.name}</strong> x{p.quantity} &nbsp;|&nbsp; ${p.price} c/u &nbsp;|&nbsp; Subtotal: ${p.price * p.quantity}
            </span>
            <button type="button" onClick={() => handleRemoveProduct(idx)} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>
              Quitar
            </button>
          </li>
        ))}
      </ul>
      {saleProducts.length > 0 && (
        <div style={{ marginBottom: 12, fontWeight: 'bold' }}>
          Total: ${saleProducts.reduce((acc, p) => acc + p.price * p.quantity, 0)}
        </div>
      )}
      <button
        type="submit"
        style={{
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '8px 16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
        disabled={saleProducts.length === 0}
      >
        Registrar Venta
      </button>
      {message && (
        <div
          style={{
            marginTop: 10,
            color: message.includes('correctamente') ? 'green' : 'red',
            fontWeight: 'bold'
          }}
        >
          {message}
        </div>
      )}
      {products.length === 0 && <div>Cargando productos...</div>}
    </form>
  );
};

export default SaleForm;