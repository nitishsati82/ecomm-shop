import React from "react";
//import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Product from "./components/Product";
import ProductDetails from "./components/ProductDetails";
import Profile from './components/Profile';
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';

import Cart from "./components/Cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:orderId" element={<OrderDetails />} /> {/* Dynamic Route */}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
