import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useCart } from "../context/CartContext"; // Import the useCart hook from context

function ProductDetails() {
  const { addToCart } = useCart(); // Use the useCart hook to get the addToCart function
  const location = useLocation();
  const product = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    //addToCart({ ...product, quantity: parseInt(quantity, 10) }); // Ensure quantity is an integer

    addToCart({
      productId: product.id,
      itemName: product.name,
      price: product.price,
      quantity: parseInt(quantity, 10), // Default quantity
      amount: product.price, // Initial amount
    });
    alert(`${quantity} ${product.name}(s) added to cart!`);
    navigate("/cart"); // Navigate to the cart page
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <img src={product.imgUrl} alt={product.name} className="img-fluid" style={{ width: "50%" }}/>
        </Col>
        <Col md={6}>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h4>₹{product.price}</h4>
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