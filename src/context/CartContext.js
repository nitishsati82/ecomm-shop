import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const getEmptyCart = () => {
    return {
      totalAmount: 0.0,
      netPayable: 0.0,
      totalDiscount: 0.0,
      totalDeliveryCharge: 0.0,
      storeId: "",
      homeDelivery: true,
      items: [],
    };
  };

  const getCartJson = () => {
    try {
      const savedCart = localStorage.getItem("OliveCart");
      return savedCart ? JSON.parse(savedCart) : getEmptyCart();
    } catch (e) {
      return getEmptyCart();
    }
  };

  const [cart, setCart] = useState(getCartJson());

  useEffect(() => {
    createCartJson();
  }, []);

  const createCartJson = () => {
    if (localStorage.getItem("OliveCart") === null) {
      localStorage.setItem("OliveCart", JSON.stringify(getEmptyCart()));
    }
  };

  const isItemExist = (id) => {
    const cartData = getCartJson();
    const items = cartData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].productId === id) {
        return true;
      }
    }
    return false;
  };

  const setCartJson = (cartData) => {
    try {
      if (cartData.items.length === 0) {
        localStorage.setItem("OliveCart", JSON.stringify(getEmptyCart()));
      } else {
        localStorage.setItem("OliveCart", JSON.stringify(cartData));
      }
      setCart(cartData);
    } catch (e) {
      alert("There was a problem saving your shopping cart to the browser local storage.");
    }
  };

  const setCartEmpty = () => {
    localStorage.setItem("OliveCart", JSON.stringify(getEmptyCart()));
    setCart(getEmptyCart());
  };

  const addItem = (item) => {
    const cartData = getCartJson();
    const items = cartData.items;
    items.push(item);
    cartData.items = items;
    setCartJson(cartData);
  };

  const updateItem = (item) => {
    const cartData = getCartJson();
    const items = cartData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].productId === item.productId) {
        const qty = parseFloat(items[i].quantity) + parseFloat(item.quantity);
        items[i].quantity = parseFloat(qty);
        items[i].amount = parseFloat((parseFloat(items[i].price) * qty).toFixed(2));
        cartData.items = items;
        setCartJson(cartData);
        break;
      }
    }
  };

  const addToCart = (item) => {
    alert("Hi");
    if (isItemExist(item.productId)) {
      updateItem(item);
    } else {
      addItem(item);
    }
    setCart(getCartJson());
  };

  const removeFromCart = (productId) => {
    const cartData = getCartJson();
    const updatedItems = cartData.items.filter(item => item.productId !== productId);
    cartData.items = updatedItems;
    setCartJson(cartData);
    setCart(getCartJson());
  };

  const clearCart = () => {
    setCartEmpty();
    setCart(getCartJson());
  };

  const getTotalItems = () => {
    return cart.items.length;
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};