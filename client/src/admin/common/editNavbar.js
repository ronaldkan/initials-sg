import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../img/logo_sgds.png';

class EditNavbar extends Component {
    render() {

        const { saveTemplate } = this.props;

        return (
            <div className="masthead-container" id="navbar">
                <div className="sgds-masthead">
                    <div className="sgds-container">
                        <div className="row">
                            <div className="col">
                                <a href="http://www.gov.sg" alt="Singapore Government" target="_blank" without rel="noopener noreferrer">
                                    <div><span className="sgds-icon sgds-icon-sg-crest is-size-5"></span> <span className="is-text">A
                                                Singapore Government Agency Website</span></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="navbar is-transparent">
                    <div className="sgds-container">
                        <div className="navbar-brand">
                            <Link className="navbar-item" to="/demo">
                                <img src={Logo} alt="" />
                            </Link>
                            <div id="mobileMain" className="navbar-burger burger" data-target="navbarMain" onClick={this.mobileMenu}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div id="navbarMain" className="navbar-menu" >
                            <div className="navbar-item is-hidden-desktop">
                            </div>
                        </div>
                        <div className="navbar-end is-hidden-touch">
                            <div className="navbar-item" onClick={() => saveTemplate()}>
                                <a className="navbar-link is-uppercase sgds-button is-rounded is-large">
                                    <h6>Save</h6>
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default EditNavbar;
