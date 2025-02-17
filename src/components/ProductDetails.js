import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { CartContext } from "../context/CartContext";

function ProductDetails() {
  const { addToCart } = useContext(CartContext);
  const location = useLocation();
  const product = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product, parseInt(quantity, 10)); // Ensure quantity is an integer
    alert(`${quantity} ${product.name}(s) added to cart!`);
    navigate("/"); // Navigate back to the product list or cart
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <img src={product.image} alt={product.name} className="img-fluid" />
        </Col>
        <Col md={6}>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h4>{product.price}</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetails;