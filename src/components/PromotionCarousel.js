import React from 'react';
import { Carousel } from 'react-bootstrap';

const PromotionCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="path/to/your/image1.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Spring Sale: Up to 50% off on selected items!</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="path/to/your/image2.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Flash Sale: 24 Hours Only! Extra 20% off on all electronics!</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="path/to/your/image3.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Just In: Check out our latest collection of fashion wear!</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default PromotionCarousel;