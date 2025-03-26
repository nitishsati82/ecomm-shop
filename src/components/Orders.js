import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Container, Table } from 'react-bootstrap';
import AWS from 'aws-sdk';
import { useAuth } from 'react-oidc-context';

AWS.config.update({
  region: 'ap-south-1' // Replace with your desired AWS region
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [error, setError] = useState(null);
  const auth = useAuth();
  const { user } = auth;
  const accessToken = user?.access_token;

  useEffect(() => {
    const fetchUserId = async () => {
      const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
      const params = {
        AccessToken: accessToken,
      };

      try {
        const userData = await cognitoIdentityServiceProvider.getUser(params).promise();
        const userId = userData.UserAttributes.find(attr => attr.Name === 'sub').Value;
        setCustomerId(userId);
        fetchOrders(userId); // Call fetchOrders with the customerId
      } catch (error) {
        console.error('Error getting user attributes:', error);
        setError(error.message);
      }
    };

    if (accessToken) {
      fetchUserId();
    }
  }, [accessToken]);

  const fetchOrders = async (customerId) => {
    if (!customerId){
      alert("Please login again!")
    }

    try {
      const response = await fetch(`http://13.235.208.227:8083/order/fetch?customerId=${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
    }
  };

  return (
    <Container style={{ padding: '20px' }}>
      <h2>My Orders</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td><Link to={`/order/${order.id}`}>{order.orderId}</Link></td> {/* Link to the dynamic order details page */}
                  <td>
                    {order.products.map((product, index) => (
                      <div key={index}>
                        {product.productName || 'Unknown'}
                      </div>
                    ))}
                  </td>
                  <td>
                    {order.products.map((product, index) => (
                      <div key={index}>
                        {product.quantity}
                      </div>
                    ))}
                  </td>
                  <td>
                    {order.products.map((product, index) => (
                      <div key={index}>
                        ₹{product.price}
                      </div>
                    ))}
                  </td>
                  <td>{order.orderStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No orders found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Orders;