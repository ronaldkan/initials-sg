import React, { Component } from 'react';
import Navbar from './navbar';
import Footer from './footer';

class About extends Component {

    render() {
        return (
            <div className="App">
                <Navbar />
                <section className="sgds-section is-small sgds-section-pagetitle">
                    <div className="sgds-container ">
                        <nav className="sgds-breadcrumb no-margin" aria-label="breadcrumbs">
                            <ul>
                                <li><a href="/"><small>HOME</small></a></li>
                                <li><a href="/about/"><small></small></a></li>
                            </ul>
                        </nav>
                    </div>
                    <div className="sgds-container ">
                        <div className="row">
                            <div className="col">
                                <h2 className="has-text-white">About</h2>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="sgds-section">
                    <div className="sgds-container">
                        <div className="content">
                            <div className="row">
                                <div className="col is-9">
                                    <h5 className="has-text-secondary has-text-weight-semibold">Initials Electronic Signature was designed to help government agencies to sign, fill, store, send and retrieve documents easily without the use of paper</h5>
                                </div>
                            </div>

                            <hr className="margin--bottom--lg margin--top--lg" />

                            <div className="row">
                                <div className="col is-9">
                                    <h3 className="has-text-weight-semibold margin--bottom">Background</h3>
                                    <p>Processing physical documents on a daily basis takes a lot of effort within government agencies. Compute the time it took one person to print those documents one by one, have them signed, prepare the documents for sending and wait for the courier to reach your recipient.</p>
                                    <p>The total amount of time would be greatly reduced with the help of Initials Electonic Signature. Once a document was prepared, all it takes is to sign it using Initials and email the document to your recipient.</p>
                                </div>
                            </div>

                            <hr className="margin--bottom--lg margin--top--lg" />

                            <div className="row">
                                <div className="col is-9">
                                    <h3 className="has-text-weight-semibold margin--bottom">Why use an electronic signature?</h3>
                                    <p>Apart of being efficient at work, Initials come with other benefits -</p>
                                    <p><b>Save money from paper costs:</b> Initials Electronic Signature will save a lot on paper supplies. By processing documents online, at least few thousands sheets of paper were saved annually. Printing and maintenance charges will be cut down as well.</p>
                                    <p><b>Make business move faster:</b> If all government agencies and vendors adopt Initials, business to business transactions will happen much faster. Payments will be easier to make and sales quotations and invoices will be received immediately. The amount of time spent in processing contracts will be cut drastically, allowing more business to be finalised in a short amount of time.</p>
                                    <p><b>Provide better services:</b> Now government agencies and vendors can sign their orders wherever they are. Invoices, delivery forms and other documents that need to be signed will get twice as fast within the comfort of own offices.</p>
                                </div>
                            </div>

                            <hr className="margin--bottom--lg margin--top--lg" />
                            <div className="row">
                                <div className="col">
                                    <h3 className="has-text-weight-semibold margin--bottom">Get in touch</h3>
                                    <p>Tell us your needs and we'll get back to you soon.</p>
                                    <a className="sgds-button is-rounded is-medium is-secondary margin--top--lg" href="https://form.gov.sg/forms/govtech/5bd18e5c46209b000f56f3e0" target="_blank">Tell us more</a>
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

export default About;
