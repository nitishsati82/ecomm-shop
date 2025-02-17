import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  const handleAdd = (product) => {
    addToCart(product, 1);
  };

  const handleRemove = (product) => {
    removeFromCart(product);
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Container className="my-5">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <Row key={item.id} className="mb-3">
              <Col md={4}>
                <img src={item.image} alt={item.name} className="img-fluid" />
              </Col>
              <Col md={4}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </Col>
              <Col md={4} className="d-flex align-items-center">
                <Button
                  variant="success"
                  className="me-2"
                  onClick={() => handleAdd(item)}
                >
                  +
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleRemove(item)}
                >
                  -
                </Button>
              </Col>
            </Row>
          ))}
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
        </>
      )}
    </Container>
  );
}

export default Cart;
