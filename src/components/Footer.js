import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './footer.css'; // Import custom CSS

const Footer = () => {
    const [showDisclaimer, setShowDisclaimer] = React.useState(false);
    const [showContactUs, setShowContactUs] = React.useState(false);
    const [showTestimonials, setShowTestimonials] = React.useState(false);
    const [showNewsletter, setShowNewsletter] = React.useState(false);
    const [showBlog, setShowBlog] = React.useState(false);

    const handleClose = (modal) => {
        switch (modal) {
            case 'disclaimer':
                setShowDisclaimer(false);
                break;
            case 'contactUs':
                setShowContactUs(false);
                break;
            case 'testimonials':
                setShowTestimonials(false);
                break;
            case 'newsletter':
                setShowNewsletter(false);
                break;
            case 'blog':
                setShowBlog(false);
                break;
            default:
                break;
        }
    };

    const handleShow = (modal) => {
        switch (modal) {
            case 'disclaimer':
                setShowDisclaimer(true);
                break;
            case 'contactUs':
                setShowContactUs(true);
                break;
            case 'testimonials':
                setShowTestimonials(true);
                break;
            case 'newsletter':
                setShowNewsletter(true);
                break;
            case 'blog':
                setShowBlog(true);
                break;
            default:
                break;
        }
    };

    return (
        <footer className="custom-footer">
            <div id="footer">
                <hr className="footer-divider" />
                <div className="copyrights">
                    <span>&copy;2025. All Rights Reserved. | Powered by 
                        <a href="#" target="_blank" rel="noopener noreferrer"> AmCart Technologies Private Limited</a> | 
                        <a href="#disclaimerModal" onClick={() => handleShow('disclaimer')}> Disclaimer</a> | 
                        <a href="#contactUsModal" onClick={() => handleShow('contactUs')}> Contact Us</a> | 
                        <a href="#testimonialsModal" onClick={() => handleShow('testimonials')}> Testimonials</a> | 
                        <a href="#newsletterModal" onClick={() => handleShow('newsletter')}> Newsletter</a> | 
                        <a href="#blogModal" onClick={() => handleShow('blog')}> Blog</a>
                    </span>
                </div>
                <div className="container-fluid">
                    <div className="row" align="center">
                        <ul id="social-media" className="social-media-list">
                            <li><a href="#" className="fb-color"><i className="fa fa-facebook fa-2x" aria-hidden="true"></i></a></li>
                            <li><a href="#" className="twitter-color"><i className="fa fa-twitter fa-2x" aria-hidden="true"></i></a></li>
                            <li><a href="#" className="google-color"><i className="fa fa-google-plus fa-2x" aria-hidden="true"></i></a></li>
                            <li><a href="#" className="pinterest-color"><i className="fa fa-pinterest-p fa-2x" aria-hidden="true"></i></a></li>
                            <li><a href="#" className="circleBase"><i className="fa fa-envelope fa-2x" aria-hidden="true"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <span id="toastMessage"></span>

            {/* Disclaimer Modal */}
            <Modal show={showDisclaimer} onHide={() => handleClose('disclaimer')} id="disclaimerModal">
                <Modal.Header closeButton>
                    <Modal.Title>Disclaimer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The information provided on this website is for general informational purposes only. While we strive to ensure the accuracy and reliability of the information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.

In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.

Through this website, you may be able to link to other websites which are not under the control of our company. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.

Every effort is made to keep the website up and running smoothly. However, our company takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose('disclaimer')}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Contact Us Modal */}
            <Modal show={showContactUs} onHide={() => handleClose('contactUs')} id="contactUsModal">
                <Modal.Header closeButton>
                    <Modal.Title>Contact Us</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>If you have any questions or need assistance, please contact us at:</p>
                    <p>Email: support@onekart.com</p>
                    <p>Phone: +1-800-123-4567</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose('contactUs')}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Testimonials Modal */}
            <Modal show={showTestimonials} onHide={() => handleClose('testimonials')} id="testimonialsModal">
                <Modal.Header closeButton>
                    <Modal.Title>Testimonials</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Here's what our customers are saying:</p>
                    <p>"OneKart has revolutionized my shopping experience!" - Jane Doe</p>
                    <p>"Excellent customer service and fast delivery." - John Smith</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose('testimonials')}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Newsletter Modal */}
            <Modal show={showNewsletter} onHide={() => handleClose('newsletter')} id="newsletterModal">
                <Modal.Header closeButton>
                    <Modal.Title>Newsletter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Subscribe to our newsletter to stay updated on the latest offers and products:</p>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email address:</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                        </div>
                        <Button variant="primary" type="submit">
                            Subscribe
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose('newsletter')}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Blog Modal */}
            <Modal show={showBlog} onHide={() => handleClose('blog')} id="blogModal">
                <Modal.Header closeButton>
                    <Modal.Title>Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Check out our latest blog posts:</p>
                    <p><a href="#" target="_blank" rel="noopener noreferrer">How to Choose the Best Mobile Phone</a></p>
                    <p><a href="#" target="_blank" rel="noopener noreferrer">Top 10 Kitchen Appliances for 2025</a></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose('blog')}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </footer>
    );
};

export default Footer;