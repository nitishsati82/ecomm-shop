import React from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { useCart } from '../context/CartContext'; // Import the useCart hook from context
import AWS from 'aws-sdk';
import { useAuth } from 'react-oidc-context'; // Import the useAuth hook from context

AWS.config.update({
  region: 'ap-south-1' // Replace with your desired AWS region
});


const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const auth = useAuth();
  const { user } = auth;
  const accessToken = user?.access_token;
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCheckout = () => {
    if (accessToken) {
      navigate('/checkout'); // Navigate to the checkout page if authenticated
    } else {
      alert('Sign in required to proceed to checkout'); // Show alert if not authenticated
    }

  };

  return (
    <Container style={{ padding: '20px' }}>
      <h2>Shopping Cart</h2>
      {cart.items.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.productId}>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.quantity * item.price}</td> {/* Display calculated total */}
                  <td>
                    <Button variant="danger" onClick={() => removeFromCart(item.productId)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="danger" onClick={clearCart}>Clear Cart</Button>
          <Button variant="primary" onClick={handleCheckout}>Proceed to Buy</Button> {/* Add Checkout button */}

        </>
      ) : (
        <p>Your cart is empty</p>
      )}
    </Container>
  );
};

export default Cart;