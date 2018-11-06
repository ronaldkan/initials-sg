import React, { Component } from 'react';
import axios from 'axios';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';

import { Layout, Input } from 'antd';
import { Document, Page } from 'react-pdf';

const { Content } = Layout;

function MailBox(props) {
    const comp = props.componentList;
    const test = comp.map((c, i) => {
        let theComp;
        if (c.hasOwnProperty('src') === false) {
            theComp = <Input
                className="completedInput"
                id={c.id}
                value={c.value}
                style={{ position: 'absolute', left: `${c.left}`, top: `${c.top}`, zIndex: 99, width: `${c.width}`, fontSize: '20px' }}
            readonly/>;
        } else {
            theComp = <img src={c.src}
                className='noBorder'
                id={c.id}
                alt='blank'
                style={{ border: '1px solid', borderColor: '#C2C2C2', position: 'absolute', left: `${c.left}`, top: `${c.top}`, width: `${c.width}`, zIndex: 99 }}
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
        axios.get(`http://localhost:5000/api/job/${this.props.match.params.uuid}`)
            .then(response => response.data)
            .then(data => {
                this.setState({ url: `http://localhost:5000/api/file?fileName=${data.Template.file}` });
                if (!data.Template) {
                    return;
                }
                let resp = JSON.parse(data.data);
                this.setState({ componentList: resp });
            });

    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }


    render() {
        const { pageNumber, url, componentList } = this.state;

        return (
            <div className="App">
                <DefaultNavbar />
                <Layout>
                    <Content style={{ margin: '24px 20% 50px 20%' }}>
                        <Document
                            className='mydoc'
                            ref='abc'
                            file={url}
                            onClick={this.onItemClick}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                            <MailBox componentList={componentList} clickMe={this.clickMe} />
                            <Page renderAnnotations={false} renderMode={"svg"} renderTextLayer={false} pageNumber={pageNumber} scale={1} />
                        </Document>
                    </Content>
                </Layout>
                <Footer />
            </div>
        );
    }
}

export default View;
