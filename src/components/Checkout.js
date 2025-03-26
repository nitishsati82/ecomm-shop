import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Modal } from 'react-bootstrap';
import { useCart } from '../context/CartContext'; // Import the useCart hook from context
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AWS from 'aws-sdk';
import { useAuth } from 'react-oidc-context';

AWS.config.update({
  region: 'ap-south-1' // Replace with your desired AWS region
});

const Checkout = () => {
  const { cart, clearCart } = useCart(); // Get cart items and clearCart function from context
  const [orderStatus, setOrderStatus] = useState('Pending');
  const [customerId, setCustomerId] = useState(''); // State to store customer ID
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main St, Dehra Dun, Uttarakhand'); // Example address
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [showInstructionsModal, setShowInstructionsModal] = useState(false); // State to control visibility of instructions modal
  const navigate = useNavigate(); // Initialize useNavigate
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
        console.log('Customer ID:', userId); // Log the customer ID
      } catch (error) {
        console.error('Error getting user attributes:', error);
      }
    };

    if (accessToken) {
      fetchUserId();
    }
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      totalPrice: cart.items.reduce((total, item) => total + item.price * item.quantity, 0),
      totalQuantity: cart.items.reduce((total, item) => total + item.quantity, 0),
      orderStatus: orderStatus,
      customerId: customerId, // Include customer ID
      deliveryAddress: deliveryAddress,
      sellerId: deliveryAddress,
      deliveryInstructions: deliveryInstructions,
      paymentMethod: 'Cash on Delivery',
      products: cart.items.map(item => ({
        productId: item.productId,
        sellerId: item.sellerId,
        quantity: item.quantity,
        price: item.price,
        productName: item.itemName
      }))
    };

    console.log('Order Data:', orderData); // Log the order data

    try {
      const response = await fetch('https://13.235.208.227:8443/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      } else {
        alert('Order created successfully!');
        clearCart(); // Clear the cart
        navigate('/'); // Redirect to home page
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order.');
    }
  };

  const handleAddressChange = () => {
    setDeliveryAddress(newAddress);
    setShowModal(false);
  };

  return (
    <Container style={{ padding: '20px' }}>
      <h2>Checkout</h2>
      <p>Delivering to: {deliveryAddress}</p>
      <Button variant="link" onClick={() => setShowModal(true)}>Change</Button>
      <Button variant="link" onClick={() => setShowInstructionsModal(true)}>Add delivery instructions</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.productId}>
              <td>{item.itemName}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price}</td>
              <td>₹{item.quantity * item.price}</td> {/* Display calculated total */}
           </tr>
          ))}
        </tbody>
      </Table>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="paymentMethod">
          <Form.Label>Payment Method</Form.Label>
          <Form.Check type="radio" label="Cash on Delivery" name="paymentMethod" id="cashOnDelivery" defaultChecked />
        </Form.Group>
        <Button variant="primary" type="submit">
          Place your order
        </Button>
      </Form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Delivery Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="newAddress">
            <Form.Label>New Address</Form.Label>
            <Form.Control
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddressChange}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInstructionsModal} onHide={() => setShowInstructionsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Delivery Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="deliveryInstructions">
            <Form.Label>Delivery Instructions</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInstructionsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowInstructionsModal(false)}>
            Save Instructions
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Checkout;