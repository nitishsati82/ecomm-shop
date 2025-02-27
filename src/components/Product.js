import React, { useState, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { CartContext } from "../context/CartContext";

function Product() {

  const { addToCart } = useContext(CartContext);
  //const { addToCart } = useCart(); // Destructure addToCart from the custom hook

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // 3 products per row, 5 rows per page
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product-details/${product.id}`, { state: product });
  };
  
  // Fetch products from Java API
  const fetchProducts = async (page) => {
    try {
      const response = await fetch(
        `http://13.200.154.116:8083/product/api/products?page=${page}&size=${itemsPerPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage); // Fetch products when the component loads or page changes
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <Container className="my-4">
      <h3 className="text-center mb-4">Products</h3>
      <Row>
        {products.map((product) => (
          <Col md={4} className="mb-4" key={product.id}>
            <Card>
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text className="fw-bold">{product.price}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="primary" className="me-2" onClick={() => addToCart({
            productId: product.id,
            itemName: product.name,
            price: product.price,
            quantity: 1, // Default quantity
            amount: product.price, // Initial amount
          })}>
                    Add to Cart
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleProductClick(product)}
                  >
                    View Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Pagination Controls */}
      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="secondary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </Container>
  );
}

export default Product;
