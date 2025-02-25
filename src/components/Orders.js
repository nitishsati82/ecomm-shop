import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Container, Table } from 'react-bootstrap';

const Orders = () => {
  // Dummy orders data
  const dummyOrders = [
    { id: 1, item: 'Laptop', quantity: 1, price: '$1200', status: 'Shipped' },
    { id: 2, item: 'Headphones', quantity: 2, price: '$200', status: 'Delivered' },
    { id: 3, item: 'Mobile Phone', quantity: 1, price: '$800', status: 'Processing' },
  ];

  return (
    <Container style={{ padding: '20px' }}>
      <h2>My Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyOrders.map((order) => (
            <tr key={order.id}>
              <td><Link to={`/order/${order.orderId}`}>{order.orderId}</Link></td> {/* Link to the dynamic order details page */}
              <td>{order.item}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Orders;