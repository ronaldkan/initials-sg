import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class Footer extends Component {

    render() {
        return (
            <div>
                <footer className="sgds-footer top-section">
                    <div className="sgds-container ">
                        <div className="row">
                            <div className="col footer-col header">
                                <h5 className="sub-header has-text-white"><b>Initials Electronic Signature</b></h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col footer-col is-3">
                                <p className="sub-header"><b>Other Common Services</b></p>
                                <p><a href="https://designsystem.gov.sg/" target="_blank">Design System <i className="sgds-icon sgds-icon-external"></i></a></p>
                                <p><a href="https://form.gov.sg/" target="_blank">FormSG <i className="sgds-icon sgds-icon-external"></i></a></p>
                            </div>
                            <div className="col footer-col is-3">
                                <p className="sub-header"><b>Related Info</b></p>
                                <p><a href="https://blog.gds-gov.tech" target="_blank">GDS Blog <i className="sgds-icon sgds-icon-external"></i></a></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col footer-col is-right-desktop-only">
                                <ul>
                                    <li className="is-inline-block-desktop-only">
                                        <p><a href="https://form.gov.sg/forms/govtech/5bd18e5c46209b000f56f3e0" target="_blank">Contact</a></p>
                                    </li>
                                    <li className="is-inline-block-desktop-only">
                                        <p><a href="/general/faq/">FAQs</a></p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
                <footer className="sgds-footer bottom-section">
                    <div className="sgds-container">
                        <div className="row is-vcentered divider">
                            <div className="col footer-col">
                                <ul>
                                    <li><Link to="/general/privacy">Privacy Statement</Link></li>
                                    <li><Link to="/general/terms">Terms of Use</Link></li>
                                </ul>
                            </div>
                            <div className="col footer-col has-text-right-desktop has-text-right-tablet has-text-left-mobile">
                                <p className="is-hidden-touch"> © 2018 Government of Singapore. Last Updated 5 June 2018</p>
                                <p className="is-hidden-desktop">© 2018 Government of Singapore</p>
                                <p className="is-hidden-desktop last-updated">Last Updated 5 June 2018</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Footer;
