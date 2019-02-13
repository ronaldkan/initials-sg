import React, { Component } from 'react';
import axios from 'axios';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';
import { decryptJobData } from '../util/jwtUtil';
import { Layout, Input } from 'antd';
import { Document, Page } from 'react-pdf';
import { getRequest, getUrl } from '../util/requestUtil';

const { Content } = Layout;
const url = getUrl();


function MailBox(props) {
    const comp = props.componentList;
    const test = comp.map((c, i) => {
        let theComp;
        if (c.pageNumber === props.pageNumber) {
            if (c.hasOwnProperty('src') === false) {
                theComp = <Input
                    className="completedInput"
                    id={c.id}
                    value={c.value}
                    style={{ position: 'absolute', left: `${c.left}`, top: `${c.top}`, zIndex: 1, width: `${c.width}`, fontSize: '1vw' }}
                    readonly />;
            } else {
                theComp = <img src={c.src}
                    className='noBorder'
                    id={c.id}
                    alt='blank'
                    style={{ border: '1px solid', borderColor: '#C2C2C2', position: 'absolute', left: `${c.left}`, top: `${c.top}`, width: `${c.width}`, zIndex: 1 }}
                />;
            }

            return (
                <div key={i}>
                    {theComp}
                </div>
            );
        }
    });
    return test;
}

function Pages(props) {
    let pageComponents = [];
    const {
        onDocumentLoadSuccess,
        componentList,
        url,
        numPages
    } = props;

    pageComponents.push(
        <div>
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <MailBox
                    componentList={componentList}
                    pageNumber={"1"}
                />
                <Page renderAnnotations={false} renderTextLayer={false} pageNumber={1} scale={1} />
            </Document>
            <br></br>
        </div>
    )
    for (var i = 1; i < numPages; i++) {
        if (i + 1 !== numPages) {
            pageComponents.push(
                <div>
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <MailBox
                            componentList={componentList}
                            pageNumber={(i + 1).toString()}
                        />
                        <Page renderAnnotations={false} renderTextLayer={false} pageNumber={i + 1} scale={1} />
                    </Document>
                    <br></br>
                </div>
            )
        } else {
            pageComponents.push(
                <div>
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <MailBox
                            componentList={componentList}
                            pageNumber={(i + 1).toString()}
                        />
                        <Page renderAnnotations={false} renderTextLayer={false} pageNumber={i + 1} scale={1} />
                    </Document>
                </div>
            )
        }
    }
    return pageComponents;
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
        getRequest(`/api/job/${this.props.match.params.uuid}`, {})
            .then(response => response.data)
            .then(data => {
                this.setState({
                    url: {
                        url: `${url}/api/file?id=${data.Template.id}`,
                        withCredentials: true,
                    }
                });
                if (!data.Template) {
                    return;
                }
                let resp = JSON.parse(decryptJobData(data.data));
                this.setState({ componentList: resp });
            });

    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }


    render() {
        const { numPages, url, componentList } = this.state;

        return (
            <div className="App">
                <DefaultNavbar />
                <Layout>
                    <Content style={{ margin: '24px 20% 50px 20%' }}>
                        <Pages onDocumentLoadSuccess={this.onDocumentLoadSuccess} numPages={numPages} componentList={componentList} url={url} />
                    </Content>
                </Layout>
                <Footer />
            </div>
        );
    }
}

export default View;
