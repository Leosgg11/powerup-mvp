import React, { useState } from 'react';

const ProductForm = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      setMessage('Completa todos los campos obligatorios.');
      return;
    }
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setMessage('Producto agregado correctamente.');
      setForm({ name: '', category: '', price: '', stock: '' });
      if (onProductAdded) onProductAdded();
    } else {
      setMessage('Error al agregar producto.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
      <input name="category" placeholder="Categoría" value={form.category} onChange={handleChange} />
      <input name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} required />
      <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
      <button type="submit">Agregar Producto</button>
      {message && <div style={{ marginTop: 10, color: res.ok ? 'green' : 'red' }}>{message}</div>}
    </form>
  );
};

export default ProductForm;