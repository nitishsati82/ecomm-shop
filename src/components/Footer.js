import React from 'react';

const Footer = () => (
    <footer>
        <div id="footer">
            <hr style={{ marginTop: '5px', marginBottom: '5px' }} />
            <div className="copyrights">
                <span>&copy;225. All Rights Reserved. | Powered by 
                    <a href="#" target="_blank" rel="noopener noreferrer">Online Shopping Technologies Private Limited</a> | 
                    <a href="#disclaimerModal" data-toggle="modal">Disclaimer</a>
                </span>
            </div>
            <div className="container-fluid">
                <div className="row" align="center">
                    <ul id="social-media" style={{ textAlign: 'center' }}>
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
    </footer>
);

export default Footer;
