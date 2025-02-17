import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Form, FormControl, Button, Container, Modal, Badge } from "react-bootstrap";
import { FaUser, FaSignInAlt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import logo from './img/logo.png';
function Header() {
  const [navLinks, setNavLinks] = useState([]);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const [guid, setGuid] = useState(null);


  // Access cart data from CartContext
  const { cart } = useContext(CartContext);

  // Calculate total quantity of items in the cart
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);


const fetchGuid = async () => {
  try {
      const response = await fetch(
        `http://13.233.103.48:8080/generate-guid`
      );
      const data = await response.text();
      console.log("response"+data);
      setGuid(data);
  } catch (error) {
      console.error('Error fetching GUID:', error);
  }
};

useEffect(() => {
  fetchGuid();
}, []);

useEffect(() => {
  if (guid !== null) {
    const staticLinks = [
      "Home",
      "Mobile Phones",
      "Home Appliances",
      "Kitchen Appliances",
      "Laptop & Computers",
      "Televisions",
      "Audio & Video",
      "Personal Care",
    ];

    // Add GUID to the navigation links once it’s available
    staticLinks.push(`GUID::${guid}`);

    // Update navigation links
    setNavLinks(staticLinks);
  }
}, [guid]);

  const handleShowSignUp = () => setShowSignUpModal(true);
  const handleCloseSignUp = () => setShowSignUpModal(false);
  const handleShowSignIn = () => setShowSignInModal(true);
  const handleCloseSignIn = () => setShowSignInModal(false);

  return (
    <>
      {/* Main Navbar */}
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          {/* Logo */}
          <Navbar.Brand href="#">
            <img src={logo} alt="Logo" height="50" />
          </Navbar.Brand>

          {/* Search Bar */}
          <Form className="d-flex mx-auto" style={{ flex: 1, maxWidth: "500px" }}>
            <FormControl
              type="search"
              placeholder="Search Products"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>

          {/* Sign Up, Sign In, and Cart */}
          <Nav>
            <Nav.Link onClick={handleShowSignUp} className="d-flex align-items-center">
              <FaUser className="me-1" /> Sign Up
            </Nav.Link>
            <Nav.Link onClick={handleShowSignIn} className="d-flex align-items-center">
              <FaSignInAlt className="me-1" /> Sign In
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center position-relative">
              <FaShoppingCart className="me-1" />
              Cart
              {totalItems > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Secondary Navbar for Dynamic Links */}
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav className="mx-auto">
            {navLinks.map((link, index) => (
              <Nav.Link href="#" key={index} className="text-white">
                {link}
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </Navbar>

      {/* Sign-Up Modal */}
      <Modal show={showSignUpModal} onHide={handleCloseSignUp}>
        <Modal.Header closeButton>
          <Modal.Title>New User Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile No</Form.Label>
              <Form.Control type="text" placeholder="Enter your mobile number" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Re-Enter Password</Form.Label>
              <Form.Control type="password" placeholder="Re-enter password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Sign-In Modal */}
      <Modal show={showSignInModal} onHide={handleCloseSignIn}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter your password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Header;