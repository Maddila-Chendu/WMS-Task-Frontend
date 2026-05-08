import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Html/Users/Login';
import Register from './components/Html/Users/Register';
import Welcome from './components/Html/Users/Welcome';
import Update from './components/Html/Users/Update';
import Delete from './components/Html/Users/Delete';
import Products from './components/Html/Warehouse/products';
import Orders from './components/Html/Warehouse/orders';
import Inventory from './components/Html/Warehouse/inventory';
import Bins from './components/Html/Warehouse/bins';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/products" element={<Products />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/bins" element={<Bins />} />
      <Route path="/update" element={<Update />} />
      <Route path="/delete" element={<Delete />} /> 
    </Routes>
  );
}

export default App;
