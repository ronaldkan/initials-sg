import React, { Component } from 'react';
import axios from 'axios';
import DefaultNavbar from '../../static/defaultNavbar';
import Footer from '../../static/footer';
import EditForm from '../form/editForm';

import { getRequest, getUrl } from '../../util/requestUtil';
import { Layout, Input, Button, Popover, notification } from 'antd';
import { Document, Page } from 'react-pdf';
import BlankImage from '../../img/blank.jpg';

const { Content, Sider } = Layout;
const ButtonGroup = Button.Group;
const url = getUrl();

function MailBox(props) {
    const comp = props.componentList;
    const test = comp.map((c, i) => {
        let theComp;
        if (c.type === 'text') {
            theComp = <Input
                className='sendinput'
                onClick={()=>props.clickInput(c.id)}
                id={c.id}
                style={{ position: 'absolute', left: `${c.left}%`, top: `${c.top}%`, zIndex: 99, height: `${c.height}%`, width: `${c.width}%`, fontSize: '20px' }}
            />;
        } else if (c.type === 'sign') {
            theComp = <img src={BlankImage}
                className='signBox'
                id={c.id}
                alt='blank'
                style={{ border: '1px solid', borderColor: '#C2C2C2', position: 'absolute', left: `${c.left}%`, top: `${c.top}%`, width: `${c.width}%`, zIndex: 99 }}
            />;
        }

        return (
            <div key={i}>
                {theComp}
            </div>
        );
    });
    return test;
}


class View extends Component {

    constructor() {
        super();
        this.state = {
            pageNumber: 1,
            url: null,
            numPages: null,
            showPopup: false,
            componentList: [],
            templateId: null
        };
    }

    componentDidMount() {
        getRequest(`/api/template?fileName=${this.props.match.params.document}`, {})
            .then(response => response.data)
            .then(data => {
                this.setState({ url: `${url}/api/file?fileName=${this.props.match.params.document}` });
                if (!data) {
                    return;
                }
                let componentList = JSON.parse(data.component);
                this.setState({ componentList: componentList, templateId: data.id });
            });

    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    backtoHome = () => {
        this.props.history.push(`/demo/edit/${this.props.match.params.document}`);
    }

    backtoHome1 = () => {
        this.props.history.push('/demo');
    }

    clickInput = (id) => {
        console.log(id);
    }

    render() {
        const { pageNumber, url, componentList, templateId } = this.state;
        const { document } = this.props.match.params;

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
                                    <MailBox componentList={componentList} clickInput={this.clickInput}/>
                                    <Page renderAnnotations={false} renderTextLayer={false} pageNumber={pageNumber} scale={1}>
                                    </Page>
                                </Document>
                            </Content>
                        </Layout>
                        <Sider width={300} style={{ background: '#fff' }}>
                            <EditForm backtoHome={() => this.backtoHome1()} saveTemplate={() => this.backtoHome()} document={document} templateId={templateId} />
                        </Sider>
                    </Layout>
                </Layout>
                <Footer />
            </div>
        );
    }
}

export default View;
