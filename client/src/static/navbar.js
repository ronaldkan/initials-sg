import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../img/logo_sgds.png';

class Navbar extends Component {

    componentDidMount() {
        var currentPath = window.location.pathname;
        if (currentPath.startsWith("/about") === true) {
            document.getElementById("aboutNav").classList.add("is-active");
        } else if (currentPath.startsWith("/faq") === true) {
            document.getElementById("faqNav").classList.add("is-active");
        }
    }

    mobileMenu = () => {
        var burgerMenu = document.getElementById("navbarMain");
        var mobileMenu = document.getElementById("mobileMain");
        if (burgerMenu.classList.contains("is-active")) {
            burgerMenu.classList.remove("is-active");
            mobileMenu.classList.remove("is-active");
        } else {
            burgerMenu.classList.add("is-active");
            mobileMenu.classList.add("is-active");
        }
    }


    render() {
        return (
            <div className="masthead-container" id="navbar">
                <div className="sgds-masthead">
                    <div className="sgds-container">
                        <div className="row">
                            <div className="col">
                                <a href="http://www.gov.sg" alt="Singapore Government" target="_blank">
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
                            <Link className="navbar-item" to="/">
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
                            <div className="navbar-item is-stretched"><Link id="aboutNav" className="navbar-link is-uppercase" to="/about">
                                <h6>About</h6>
                            </Link>
                            </div>
                            <div className="navbar-item is-stretched"><Link id="faqNav" className="navbar-link is-uppercase " to="/faq">
                                <h6>FAQs</h6>
                            </Link>
                            </div>
                        </div>
                        <div className="navbar-end is-hidden-touch">
                            <div className="navbar-item">
                                <a className="navbar-link is-uppercase sgds-button is-rounded is-large" href="https://form.gov.sg/forms/govtech/5bd18e5c46209b000f56f3e0"
                                    target="_blank">
                                    <h6>Request Demo</h6>
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;
