import React from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext'; // Import the useCart hook from context

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();

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
        </>
      ) : (
        <p>Your cart is empty</p>
      )}
    </Container>
  );
};

export default Cart;