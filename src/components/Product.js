import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { CartContext } from "../context/CartContext";

function Product() {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(""); // State for sorting option
  const [selectedBrands, setSelectedBrands] = useState([]); // State for brand filter
  const [brands, setBrands] = useState([]); // State for storing fetched brands
  const itemsPerPage = 15; // 3 products per row, 5 rows per page
  const navigate = useNavigate();
  const location = useLocation();

  const handleProductClick = (product) => {
    navigate(`/product-details/${product.id}`, { state: product });
  };

  // Fetch products from Java API
  const fetchProducts = async (page, sort, brands) => {
    try {
      const brandQuery = brands.length > 0 ? `&brands=${brands.join(",")}` : "";
      let sortParam = "";
    if (sort === "asc") {
      sortParam = "asc";
    } else if (sort === "desc") {
      sortParam = "desc";
    }
      const response = await fetch(
        `http://13.235.208.227:8089/product/api/products?page=${page}&size=${itemsPerPage}&sort=${sort}${brandQuery}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      console.log("Fetched products data:", data); // Log the fetched data

      if (data && data.products) {
        const products = data.products;

        // Fetch stock count for each product from inventory service
        const updatedProducts = await Promise.all(products.map(async (product) => {
          const stockResponse = await fetch(`http://13.235.208.227:8089/inventory/check/${product.id}`);
          const stockCount = await stockResponse.json();
          return { ...product, stockCount };
        }));

        setProducts(updatedProducts);
        setTotalPages(data.totalPages);
      } else {
        console.error("Invalid data structure:", data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch brands from Java API
  const fetchBrands = async () => {
    try {
      const response = await fetch("http://13.235.208.227:8089/product/brands");
      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await response.json();
      console.log("Fetched brands data:", data); // Log the fetched data
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands(); // Fetch brands when the component mounts
  }, []);

  useEffect(() => {
    if (location.state && location.state.searchResults) {
      setProducts(location.state.searchResults); // Set search results if available
      setTotalPages(1); // Assuming search results fit on one page
    } else if (selectedBrands.length === 0) {
      fetchProducts(currentPage, sortBy, selectedBrands); // Fetch products when the component loads or page changes
    }
  }, [currentPage, sortBy, selectedBrands, location.state]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
  setSortBy(selectedSort);
  fetchProducts(currentPage, selectedSort, selectedBrands); 
  };

  const handleBrandChange = async (e) => {
    e.stopPropagation(); // Prevent event propagation
    const brand = e.target.value;
    const updatedSelectedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
  
    setSelectedBrands(updatedSelectedBrands);
  
    try {
      // Construct API query based on selected brands
      const query = updatedSelectedBrands.join(" ");
      const response = await fetch(`http://13.200.154.116:8089/product/search?query=${query}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Fetched filtered products:", data); // Debugging log
  
      // Ensure `data` has `products` key and it's an array
      if (!data || !Array.isArray(data.products)) {
        console.error("Invalid data structure:", data);
        return; // Exit function if data structure is incorrect
      }
  
      const products = data.products;
  
      // Fetch stock count for each product
      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          try {
            const stockResponse = await fetch(`http://localhost:8081/inventory/check/${product.id}`);
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
      setTotalPages(data.totalPages || 1); // Ensure totalPages is handled correctly
  
      // Navigate with only `products` instead of entire `data`
      navigate("/", { state: { searchResults: updatedProducts } });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };  

  return (
    <Container className="my-4">
      <Row>
        <Col md={2}>
          <h5>Filter by Brand</h5>
          <Form.Group controlId="brand-filter" className="mb-4">
            {brands.map((brand) => (
              <Form.Check
                key={brand}
                type="checkbox"
                label={brand}
                value={brand}
                onChange={handleBrandChange}
                checked={selectedBrands.includes(brand)}
              />
            ))}
          </Form.Group>
        </Col>
        <Col md={8}>
          <h3 className="text-center mb-4">Products</h3>
          {products.length > 0 ? (
            <>
             <Row>
  {products.map((product) => (
    <Col md={4} className="mb-4" key={product.id}>
      <Card className="h-100 d-flex flex-column"> {/* Ensure cards have equal height */}
        <Card.Img 
          variant="top" 
          src={product.imgUrl} 
          style={{ height: '200px', width: '100%', objectFit: 'contain' }} 
        />
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text className="text-muted">{product.brand}</Card.Text>

            {/* Price & Discount Display */}
            {product.discount > 0 ? (
              <div>
                <span className="text-danger fw-bold me-2">₹{product.discountPrice.toFixed(2)}</span>
                <span className="text-muted text-decoration-line-through">₹{product.price.toFixed(2)}</span>
                <span className="ms-2 text-success">({product.discount}% OFF)</span>
              </div>
            ) : (
              <div>
                <span className="fw-bold">₹{product.price.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Buttons Always at the Bottom */}
          {product.stockCount > 0 ? (
            <div className="d-flex justify-content-between mt-3">
              <Button
                variant="primary"
                className="me-2 d-flex align-items-center"
                onClick={() =>
                  addToCart({
                    productId: product.id,
                    sellerId: product.sellerId,
                    itemName: product.name,
                    price: product.discountPrice || product.price,
                    quantity: 1,
                    amount: product.discountPrice || product.price,
                  })
                }
              >
                <i className="bi bi-cart me-2"></i> {/* Cart Icon */}
                Add to Cart
              </Button>
              <Button variant="secondary" onClick={() => handleProductClick(product)}>
                View Details
              </Button>
            </div>
          ) : (
            <p className="text-danger mt-3">Out of Stock</p>
          )}
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
            </>
          ) : (
            <p className="text-center">No matching results</p>
          )}
        </Col>
        <Col md={2}>
          <h5>Sort By</h5>
          <Form.Group controlId="sort-by" className="mb-4">
            <Form.Label>Sort By</Form.Label>
            <Form.Control as="select" value={sortBy} onChange={handleSortChange}>
              <option value="">Select</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}

export default Product;