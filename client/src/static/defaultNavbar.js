import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../img/logo_sgds.png';

class DefaultNavbar extends Component {

    render() {
        return (
            <div className="masthead-container is-fixed" id="navbar">
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
                            <Link className="navbar-item" to="/">
                                <img src={Logo} alt="" />
                            </Link>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default DefaultNavbar;
