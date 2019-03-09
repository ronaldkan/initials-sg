import React, { Component } from 'react';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';
import Sidebar from './common/sidebar';
import DataTable from './common/dataTable';
import { getRequest, getBlobRequest, putRequest } from '../util/requestUtil';

class AddressBookEntry extends Component {      

    constructor() {
        super();
    }
    
    getToHome = () => {
        this.props.history.push('/admin/home');
    }

    render() {
        const columnNames = ["key", "id", "email", "phonenumber", "firstname", "lastname", "createdAt", "updatedAt"];
        const tableName = "AddressBookEntries";
        const apiName = "/api/admin_addressbookentry";
        const entity = "AddressBookEntry";

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
                                <DataTable entity={entity} apiName={apiName} tableName={tableName} columnNames={columnNames}/>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }
}

export default AddressBookEntry;
