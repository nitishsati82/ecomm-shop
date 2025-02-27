import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Form, FormControl, Button, Container, Modal, Badge, Dropdown } from "react-bootstrap";
import { FaUser, FaSignInAlt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "react-oidc-context";  // Use the OIDC context to get the user info
import logo from './img/logo.png';

function Header() {
  const [navLinks, setNavLinks] = useState([]);
  const [guid, setGuid] = useState(null);

  // Access cart data from useCart hook
  const { getTotalItems } = useCart();

  // Calculate total quantity of items in the cart
  const totalItems = getTotalItems();


  // Calculate total quantity of items in the cart
  //const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const fetchGuid = async () => {
    try {
      const response = await fetch(`http://13.200.154.116:8083/user/generate-guid`);
      const data = await response.text();
      console.log("response" + data);
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
        { name: "Home", path: "/" },
        { name: "Mobile Phones", path: "/mobile-phones" },
        { name: "Home Appliances", path: "/home-appliances" },
        { name: "Kitchen Appliances", path: "/kitchen-appliances" },
        { name: "Laptop & Computers", path: "/laptops-computers" },
        { name: "Televisions", path: "/televisions" },
        { name: "Audio & Video", path: "/audio-video" },
        { name: "Personal Care", path: "/personal-care" },
      ];
      // Add GUID to the navigation links once it’s available
      staticLinks.push({ name: `GUID::${guid}`, path: "#" });
      // Update navigation links
      setNavLinks(staticLinks);
    }
  }, [guid]);

  const auth = useAuth();

  // Function to get user info (this will vary depending on how you use the OIDC context or AWS SDK)
  const [userDetails, setUserDetails] = useState(null);

  // Method to extract and set user details
  const setUserDetailsFromAuth = (user) => {
    if (user) {
      const username = user.profile["cognito:username"];
      const name = user.profile.name;
      const email = user.profile.email;
      const phoneNumber = user.profile.phone_number;
      console.log(name);
      // Update state with the extracted user details
      setUserDetails({
        name,
        email,
        phoneNumber,
      });
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      const userInfo = auth.user;  // This assumes the OIDC context provides user info like name and email
      setUserDetailsFromAuth(userInfo);
    }
  }, [auth.isAuthenticated, auth.user]);

  // Sign out logic
  const signOutRedirect = () => {
    auth.removeUser();
    const clientId = "7gp6ln0g9gek7h4nkjru0d98tm";
    const logoutUri = "http://localhost:3000/";
    const cognitoDomain = "https://ap-south-1kbml7t4jr.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

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
            {!auth.isAuthenticated ? (
              <Nav.Link onClick={auth.signinRedirect} className="d-flex align-items-center">
                <FaSignInAlt className="me-1" /> Sign In
              </Nav.Link>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" id="dropdown-user" className="d-flex align-items-center">
                  <FaUser className="me-1" /> Hi, {userDetails ? userDetails.name : 'User'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">Orders</Dropdown.Item>
                  <Dropdown.Item onClick={() => signOutRedirect()}>Sign Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
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
              <Nav.Link as={Link} to={link.path} key={index} className="text-white">
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
