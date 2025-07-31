import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const ProductList = ({ refresh }) => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', category: '', price: '', stock: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [refresh]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p._id !== id));
      setMessage('Producto eliminado correctamente.');
    } catch {
      setMessage('Error al eliminar producto.');
    }
  };

  const handleEdit = product => {
    setEditing(product._id);
    setEditForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock
    });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    if (Number(editForm.price) < 0 || Number(editForm.stock) < 0) {
      alert('El precio y el stock deben ser valores positivos.');
      return;
    }
    await fetch(`http://localhost:5000/api/products/${editing}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    setEditing(null);
    setEditForm({ name: '', category: '', price: '', stock: '' });
    setMessage('Producto editado correctamente.');
    // Refresca la lista
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  return (
    <>
      {message && <div style={{ color: 'green', marginBottom: 8 }}>{message}</div>}
      <ul style={{ padding: 0 }}>
        {products.map(product =>
          editing === product._id ? (
            <li key={product._id} style={{ background: '#fffde7', marginBottom: 8, padding: '10px 16px', borderRadius: 4 }}>
              <form onSubmit={handleEditSubmit} style={{ display: 'flex', gap: 8 }}>
                <input name="name" value={editForm.name} onChange={handleEditChange} required />
                <input name="category" value={editForm.category} onChange={handleEditChange} />
                <input name="price" type="number" value={editForm.price} onChange={handleEditChange} required />
                <input name="stock" type="number" value={editForm.stock} onChange={handleEditChange} required />
                <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px' }}>Guardar</button>
                <button type="button" onClick={() => setEditing(null)} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px' }}>Cancelar</button>
              </form>
            </li>
          ) : (
            <li key={product._id} style={{ background: '#f1f8e9', marginBottom: 8, padding: '10px 16px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <strong>{product.name}</strong> | {product.category} | ${product.price} | Stock: {product.stock}
              </span>
              <span>
                <button onClick={() => handleEdit(product)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', marginRight: 8 }}>Editar</button>
                <button onClick={() => handleDelete(product._id)} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px' }}>Eliminar</button>
              </span>
            </li>
          )
        )}
        {products.length === 0 && <div>Cargando productos...</div>}
      </ul>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ProductList /> {/* Muestra la lista de productos */}
      </header>
    </div>
  );
}

export default App;
