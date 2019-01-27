import React, { Component } from 'react';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';
import Sidebar from './common/sidebar';
import AddAdminForm from './form/addAdminForm';
import { getRequest, getBlobRequest, putRequest } from '../util/requestUtil';

class Account extends Component {

    constructor() {
        super();
    }
    
    getToHome = () => {
        this.props.history.push('/platform/login');
    }

    render() {

        return (
            <div className="App">
                <DefaultNavbar />
                <section className="sgds-section">
                    <div className="sgds-container">
                        <div className="row">
                            <div className="col is-3 is-hidden-touch has-side-nav">
                                <Sidebar getToHome={this.getToHome}/>
                            </div>
                            <div className="col is-9 is-hidden-touch has-side-nav">
                                <AddAdminForm />
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }
}

export default Account;
