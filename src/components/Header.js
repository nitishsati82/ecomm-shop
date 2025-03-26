import React, { useState, useEffect } from "react";
import { Navbar, Nav, Form, FormControl, Button, Container, Badge, Dropdown } from "react-bootstrap";
import { FaUser, FaSignInAlt, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "react-oidc-context";
import './Style.css'; // Import custom CSS

function Header() {
  const [navLinks, setNavLinks] = useState([]);
  const [guid, setGuid] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState(""); // State to store search query
  const navigate = useNavigate();

  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const fetchGuid = async () => {
    try {
      const data = "2797901a-6378-4107-bf4b-3cb2fd132ce6";
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
        { name: "Kids Care", path: "/kids-care" },
        { name: "Audio & Video", path: "/audio-video" },
        { name: "Personal Care", path: "/personal-care" },
      ];
      staticLinks.push({ name: `GUID::${guid}`, path: "#" });
      setNavLinks(staticLinks);
    }
  }, [guid]);

  const auth = useAuth();
  const [userDetails, setUserDetails] = useState(null);

  const setUserDetailsFromAuth = (user) => {
    if (user) {
      const username = user.profile["cognito:username"];
      const name = user.profile.name;
      const email = user.profile.email;
      const phoneNumber = user.profile.phone_number;
      console.log(name);
      setUserDetails({
        name,
        email,
        phoneNumber,
      });
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      const userInfo = auth.user;
      setUserDetailsFromAuth(userInfo);
    }
  }, [auth.isAuthenticated, auth.user]);

  const signOutRedirect = () => {
    auth.removeUser();
    const clientId = "7gp6ln0g9gek7h4nkjru0d98tm";
    const logoutUri = "https://13.235.208.227/";
    const cognitoDomain = "https://ap-south-1kbml7t4jr.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://13.200.154.116:8081/product/search?query=${query}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch search results: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Fetched search results:", data);
  
      // Validate API response structure
      if (!data || !Array.isArray(data.products)) {
        console.error("Invalid data structure:", data);
        return;
      }
  
      const products = data.products;
  
      // Fetch stock count for each product
      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          try {
            const stockResponse = await fetch(`http://13.235.208.227:8081/inventory/check/${product.id}`);
            if (!stockResponse.ok) {
              throw new Error(`Failed to fetch stock for product ID ${product.id}`);
            }
            const stockCount = await stockResponse.json();
            return { ...product, stockCount };
          } catch (stockError) {
            console.error("Error fetching stock count:", stockError);
            return { ...product, stockCount: 0 }; // Default stock count if API fails
          }
        })
      );
  
      setProducts(updatedProducts);
      setTotalPages(data.totalPages || 1);
  
      // Navigate with updated product list
      navigate("/", { state: { searchResults: updatedProducts } });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  
  const handleCategoryClick = async (category) => {
    if (category === "Home") {
      navigate("/");
      return;
    }
  
    try {
      const response = await fetch(`http://13.200.154.116:8081/product/search?query=${category}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch category products: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log(`Fetched products for category "${category}":`, data);
  
      // Validate API response structure
      if (!data || !Array.isArray(data.products)) {
        console.error("Invalid data structure:", data);
        return;
      }
  
      const products = data.products;
  
      // Fetch stock count for each product
      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          try {
            const stockResponse = await fetch(`http://13.235.208.227:8081/inventory/check/${product.id}`);
            if (!stockResponse.ok) {
              throw new Error(`Failed to fetch stock for product ID ${product.id}`);
            }
            const stockCount = await stockResponse.json();
            return { ...product, stockCount };
          } catch (stockError) {
            console.error("Error fetching stock count:", stockError);
            return { ...product, stockCount: 0 }; // Default stock count if API fails
          }
        })
      );
  
      setProducts(updatedProducts);
      setTotalPages(data.totalPages || 1);
  
      // Navigate with updated product list
      navigate("/", { state: { searchResults: updatedProducts } });
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };
  
  return (
    <>
      <Navbar bg="primary" expand="lg" className="mb-3 custom-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <div className="custom-logo">
              <span className="logo-text">AmCart</span>
              <FaShoppingCart className="logo-icon" />
              <span className="logo-slogan">Your shopping simplified</span>
            </div>
          </Navbar.Brand>
          <Form className="d-flex mx-auto" style={{ flex: 1, maxWidth: "500px" }} onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search Products"
              className="me-2"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="outline-light" type="submit">Search</Button>
          </Form>
          <Nav>
            {!auth.isAuthenticated ? (
              <Nav.Link onClick={auth.signinRedirect} className="d-flex align-items-center text-white">
                <FaSignInAlt className="me-1" /> Sign In
              </Nav.Link>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" id="dropdown-user" className="d-flex align-items-center text-white">
                  <FaUser className="me-1" /> Hi, {userDetails ? userDetails.name : 'User'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">Orders</Dropdown.Item>
                  <Dropdown.Item onClick={() => signOutRedirect()}>Sign Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center position-relative text-white">
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
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav className="mx-auto">
            {navLinks.map((link, index) => (
              <Nav.Link
                as={Link}
                to={link.path}
                key={index}
                className="text-white"
                onClick={() => handleCategoryClick(link.name)}
              >
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