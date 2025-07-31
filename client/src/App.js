import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import SaleForm from './SaleForm';
import SaleList from './SaleList';

function App() {
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [refreshSales, setRefreshSales] = useState(false);

  const handleProductAdded = () => setRefreshProducts(!refreshProducts);
  const handleSaleAdded = () => setRefreshSales(!refreshSales);

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Productos</Link> | <Link to="/ventas">Ventas</Link>
        </nav>
        <hr />
        <Routes>
          <Route
            path="/"
            element={
              <section>
                <h1>Gestión de Productos</h1>
                <ProductForm onProductAdded={handleProductAdded} />
                <hr />
                <ProductList refresh={refreshProducts} />
              </section>
            }
          />
          <Route
            path="/ventas"
            element={
              <section>
                <h1>Registrar Venta</h1>
                <SaleForm onSaleAdded={handleSaleAdded} />
                <hr />
                <SaleList refresh={refreshSales} />
              </section>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
