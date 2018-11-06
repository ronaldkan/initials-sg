import React, { Component } from 'react';
import Navbar from '../../static/defaultNavbar';
import Footer from '../../static/footer';

class Complete extends Component {

    render() {
        return (
            <div className="App">
                <Navbar />
                <div class="sgds-container">
                    <div class="row" style={{ minHeight: '60vh', marginTop: '25px' }}>
                        <div class="col is-half is-offset-one-quarter">
                            <div class="content has-text-centered">
                                <h3>Complete!</h3>
                                <p>You have successfully signed the document.</p>
                                <a class="sgds-button is-secondary is-rounded" href="/demo/home">Back to home</a>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Complete;
