import React, { Component } from 'react';
import Logo from '../img/logo_sgds.png';
import HowImage from '../img/img_howitworks.png';
import Navbar from './navbar';
import Footer from './footer';

class Home extends Component {

    render() {
        return (
            <div className="App">
                <Navbar />
                <section className="sgds-hero bg-hero">
                    <div className="sgds-hero-body sgds-container is-fluid">
                        <div className="row is-vcentered">
                            <div className="col is-8 is-offset-2 has-text-centered has-text-white">
                                <h1 className="display"><b>electronic signature</b></h1>
                                <br />
                                <h5 className="is-hidden-mobile">Helps government agencies to sign, fill, store, send and retrieve documents easily without the use of paper</h5>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="sgds-section is-paddingless" id="key-highlights">
                    <div className="sgds-container">
                        <div className="row is-gapless has-text-centered">
                            <div className="col" onclick="location.href='/about/';">
                                <h5 className="has-text-white"><b>Discover Initials</b></h5>
                                <h6 className="has-text-white-trans is-small">Understand how the system works with complete document flows</h6>
                            </div>
                            <div className="col" onclick="location.href='/general/coming-soon/';">
                                <h5 className="has-text-white"><b>API Documentation</b></h5>
                                <h6 className="has-text-white-trans is-small">Find out how you can embed Initials as part of your existing workflow</h6>
                            </div>
                            <div className="col" onclick="location.href='/general/coming-soon/';">
                                <h5 className="has-text-white"><b>Start Using Initials</b></h5>
                                <h6 className="has-text-white-trans is-small">Existing application can easily integrate Initials into their workflow via a Restful API</h6>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="sgds-section bg-light">
                    <div className="sgds-container">
                        <div className="content">
                            <div className="row has-text-centered">
                                <div className="col is-10 is-offset-1">
                                    <h2 className="has-text-weight-normal has-text-primary">Working with Initials</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col is-10 is-offset-1">
                                    <img src={HowImage} alt="How it works" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="sgds-section">
                    <div className="sgds-container">
                        <div className="content">
                            <div className="row has-text-centered">
                                <div className="col is-10 is-offset-1">
                                    <h2 className="has-text-weight-normal has-text-primary">Values of Electronic Signature</h2>
                                </div>
                            </div>
                            <div className="row has-text-centered">
                                <div className="col is-10 is-offset-1">
                                    <div className="row">
                                        <div className="col is-3">
                                            <span className="has-text-primary sgds-icon sgds-icon-lock is-size-1"></span>
                                            <h5 className="margin--top"><b>Enhanced Security</b></h5>
                                            <h6 className="is-small has-text-weight-normal">Data is protected with encryption when in transit to recipient.</h6>
                                        </div>
                                        <div className="col is-3">
                                            <span className="has-text-primary sgds-icon sgds-icon-template is-size-1"></span>
                                            <h5 className="margin--top"><b>Reusable Templates</b></h5>
                                            <h6 className="is-small has-text-weight-normal">Upload document and convert into a template for repeated uses.</h6>
                                        </div>
                                        <div className="col is-3">
                                            <span className="has-text-primary sgds-icon sgds-icon-share is-size-1"></span>
                                            <h5 className="margin--top"><b>APIs for Existing Apps</b></h5>
                                            <h6 className="is-small has-text-weight-normal">Easy to integrate with existing applications with REST APIs.</h6>
                                        </div>
                                        <div className="col is-3">
                                            <span className="has-text-primary sgds-icon sgds-icon-card is-size-1"></span>
                                            <h5 className="margin--top"><b>Cross-Zone</b></h5>
                                            <h6 className="is-small has-text-weight-normal">Access and complete documents anywhere and
                            everywhere.</h6>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col is-3">
                                            <span className="has-text-primary sgds-icon sgds-icon-circle-info is-size-1"></span>
                                            <h5 className="margin--top"><b>Notification</b></h5>
                                            <h6 className="is-small has-text-weight-normal">Flags and live progress bar help reduce errors and omissions.</h6>
                                        </div>
                                        <div className="col is-3">
                                            <span className="has-text-primary sgds-icon sgds-icon-expand-alt is-size-1"></span>
                                            <h5 className="margin--top"><b>Delegation</b></h5>
                                            <h6 className="is-small has-text-weight-normal">Redirect templates to the right person or
                            cycle through a flow.</h6>
                                        </div>
                                        <div className="col is-3">
                                            <span className="has-text-primary sgds-icon sgds-icon-layers is-size-1"></span>
                                            <h5 className="margin--top"><b>Multi-Platforms</b></h5>
                                            <h6 className="is-small has-text-weight-normal">Works on any desktops and phones with no downloads or plugins.</h6>
                                        </div>
                                        <div className="col is-3">
                                            <span className="has-text-primary sgds-icon sgds-icon-file-alt is-size-1"></span>
                                            <h5 className="margin--top"><b>Audit Logs</b></h5>
                                            <h6 className="is-small has-text-weight-normal">Every template and signature is secured and traceable.</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="sgds-section bg-secondary">
                    <div className="sgds-container">
                        <div className="content">
                            <div className="row has-text-centered">
                                <div className="col is-10 is-offset-1">
                                    <h2 className="has-text-white has-text-weight-normal is-offset-1">Be Part of the Change</h2>
                                </div>
                            </div>
                            <div className="row has-text-centered">
                                <div className="col is-10 is-offset-1">
                                    <p className="has-text-white padding--bottom--lg">Initials aims to be the electronic signature platform with the security to protect your agencies' documents. We will maintain regular updates and open so it will be a living, continually evolving set of tools.</p>
                                    <a className="sgds-button is-rounded is-medium" href="https://form.gov.sg/forms/govtech/5bd18e5c46209b000f56f3e0" target="_blank">Let's Connect</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }
}

export default Home;
