import React, { Component } from 'react';

import DefaultNavbar from '../../static/defaultNavbar';
import Footer from '../../static/footer';
import EditForm from '../form/editForm';
import Pdf1 from '../../img/nda.pdf';
import { Layout, Input, Button, Popover, notification } from 'antd';
import { Document, Page } from 'react-pdf';
const { Header, Content, Sider } = Layout;

class View extends Component {

    constructor() {
        super();
        this.state = {
            pageNumber: 1,
            url: "http://localhost:5000/api/view",
            numPages: null,
            showPopup: false,
            componentList: []
        };
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    render() {
        const { pageNumber, url } = this.state;

        return (
            <div className="App">
                <DefaultNavbar />
                <Layout>
                    <Layout style={{ minHeight: '100vh' }}>
                        <Layout>
                            <Content style={{ margin: '24px 20% 10px 20%' }}>
                                <Document
                                    file={url}
                                    onLoadSuccess={this.onDocumentLoadSuccess}
                                >
                                    <Page renderMode={"svg"} renderTextLayer={false} pageNumber={pageNumber} scale={1}>
                                    </Page>
                                </Document>
                            </Content>
                        </Layout>
                        <Sider width={300} style={{ background: '#fff' }}>
                            <EditForm backtoHome={() => this.backtoHome()} saveTemplate={() => this.saveTemplate(this.backtoHome)} document={document} />
                        </Sider>
                    </Layout>
                </Layout>
                <Footer />
            </div>
        );
    }
}

export default View;
