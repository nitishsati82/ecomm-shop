// OrderDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, ListGroup } from 'react-bootstrap';

const OrderDetails = () => {
  const { orderId } = useParams(); // Extract the orderId from the URL
  
  const orderDetails = [
    { id: 1, item: 'Laptop', quantity: 1, price: '$1200', status: 'Shipped' },
    { id: 2, item: 'Headphones', quantity: 2, price: '$200', status: 'Delivered' },
    { id: 3, item: 'Mobile Phone', quantity: 1, price: '$800', status: 'Processing' },
  ];

  // Fetching the order based on orderId
  const order = orderDetails[orderId];

  return (
    <Container style={{ padding: '20px' }}>
      <h2>Order Details</h2>
      {order ? (
        <Card>
          <Card.Body>
            <Card.Title>Order ID: {orderId}</Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>Item:</strong> {order.item}</ListGroup.Item>
              <ListGroup.Item><strong>Quantity:</strong> {order.quantity}</ListGroup.Item>
              <ListGroup.Item><strong>Price:</strong> {order.price}</ListGroup.Item>
              <ListGroup.Item><strong>Status:</strong> {order.status}</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      ) : (
        <p>Order not found</p>
      )}
    </Container>
  );
};

export default OrderDetails;