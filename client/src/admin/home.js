import React, { Component } from 'react';
import axios from 'axios';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';
import Sidebar from './common/sidebar';
import { getRequest, getUrl } from '../util/requestUtil';
import { List, Button, Upload, message, Icon } from 'antd';
const url = getUrl();

class Home extends Component {

    constructor() {
        super();
        this.state = {
            documents: []
        };
    }

    getDocuments = () => {
        getRequest('/api/documents', {})
            .then(response => response.data)
            .then(data => {
                let myData = [];
                data.forEach(element => {
                    myData.push({
                        title: element.file,
                        description: 'Uploaded by ' + element.createdBy
                    })
                });
                this.setState({ documents: myData });
            });
    }

    getUploadProps(getDocs) {
        return {
            action: `${url}/api/upload`,
            onChange({ file, fileList }) {
                if (file.status === 'done') {
                    message.success(`${file.name} file uploaded successfully`);
                    getDocs();
                } else if (file.status === 'error') {
                    message.error(`${file.name} file upload failed.`);
                }
            }
        }
    }

    getToHome = () => {
        this.props.history.push('/admin/home');
    }

    componentDidMount() {
        this.getDocuments();
    }

    render() {
        const { documents } = this.state;
        const props = this.getUploadProps(this.getDocuments);

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
                                Manage your admin stuffs here.
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
