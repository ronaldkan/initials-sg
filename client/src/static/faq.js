import React, { Component } from 'react';
import Navbar from './navbar';
import Footer from './footer';

class Faq extends Component {
    render() {
        return (
            <div className="App">
                <Navbar />
                <section className="sgds-section is-small sgds-section-pagetitle">
                    <div className="sgds-container ">
                        <nav className="sgds-breadcrumb no-margin" aria-label="breadcrumbs">
                            <ul>
                                <li><a href="/"><small>HOME</small></a></li>

                                <li><a href="/general/faq/"><small></small></a></li>

                            </ul>
                        </nav>
                    </div>
                    <div className="sgds-container ">
                        <div className="row">
                            <div className="col">
                                <h2 className="has-text-white">Frequently Asked Questions</h2>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="sgds-section">
                    <div className="sgds-container">
                        <div className="content">
                            <div className="row padding--top padding--bottom">
                                <div className="col is-9">
                                    <h3 className="has-text-weight-semibold margin--bottom">What is Initials Electronic Signature?</h3>
                                    <p><b>Initials Electronic Signature</b> is a collection of UI components and design patterns that were built with the best UX practices in mind. The purpose of the design system is to provide the public with a unified experience across all public-facing government digital services.</p>
                                    <p>This portal was created as a resource hub for developers, UX designers and writers that are working on government digital services.</p>
                                </div>
                            </div>

                            <hr />

                            <div className="row padding--top--lg padding--bottom--lg">
                                <div className="col is-9">
                                    <h3 className="has-text-weight-semibold margin--bottom">How can I start using Initials?</h3>
                                    <p>Please drop us a message to discuss on your requirements and we'll guide you for the next steps.</p>
                                    <a className="sgds-button is-rounded is-medium is-secondary margin--top--lg" href="/general/coming-soon/">Tell us more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>)
    }
}
export default Faq;