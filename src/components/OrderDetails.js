import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, ListGroup } from 'react-bootstrap';

const OrderDetails = () => {
  const { orderId } = useParams(); // Extract the orderId from the URL
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://13.235.208.227:8083/order/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError(error.message);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <Container style={{ padding: '20px' }}>
      <h2>Order Details</h2>
      {error ? (
        <p>{error}</p>
      ) : order ? (
        <Card>
          <Card.Body>
            <Card.Title>Order ID: {orderId}</Card.Title>
            <ListGroup variant="flush">
              {order.products.map((product, index) => (
                <ListGroup.Item key={index}>
                  <strong>Product:</strong> {product.productName || 'Unknown'}<br />
                  <strong>Quantity:</strong> {product.quantity}<br />
                  <strong>Price:</strong> ₹{product.price}<br />
                </ListGroup.Item>
              ))}
              <ListGroup.Item><strong>Status:</strong> {order.orderStatus}</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default OrderDetails;