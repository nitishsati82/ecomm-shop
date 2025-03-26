import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useCart } from "../context/CartContext"; // Import the useCart hook from context

function ProductDetails() {
  const { addToCart } = useCart(); // Use the useCart hook to get the addToCart function
  const location = useLocation();
  const product = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const [stockCount, setStockCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStockCount = async () => {
      try {
        const response = await fetch(`https://13.235.208.227:8443/inventory/check/${product.id}`);
        const stock = await response.json();
        setStockCount(stock);
      } catch (error) {
        console.error('Error fetching stock count:', error);
      }
    };

    if (product.id) {
      fetchStockCount();
    }
  }, [product.id]);

  const handleAddToCart = () => {
    if (quantity > stockCount) {
      alert(`Cannot add more than ${stockCount} items to the cart.`);
      return;
    }

    addToCart({
      productId: product.id,
      itemName: product.name,
      price: product.price,
      quantity: parseInt(quantity, 10), // Ensure quantity is an integer
      amount: product.price, // Initial amount
    });
    alert(`${quantity} ${product.name}(s) added to cart!`);
    navigate("/cart"); // Navigate to the cart page
  };

  const renderDescription = (description) => {
    return description.split('\n').map((line, index) => (
      <li key={index}>{line}</li>
    ));
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <img 
            src={product.imgUrl} 
            alt={product.name} 
            className="img-fluid" 
            style={{ height: '300px', width: '100%', objectFit: 'contain' }} 
          />
        </Col>
        <Col md={6}>
          <h1>{product.name}</h1>
          <ul>{renderDescription(product.description)}</ul>
          <h4>₹{product.price}</h4>
          {stockCount > 0 ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={quantity}
                  min={1}
                  max={stockCount}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Form.Group>
              <Button variant="success" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </Form>
          ) : (
            <p className="text-danger">Out of Stock</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetails;