import React, { Component } from 'react';
import DefaultNavbar from '../../static/defaultNavbar';
import Footer from '../../static/footer';
import EditForm from '../form/editForm';
import { getRequest, getUrl } from '../../util/requestUtil';
import { Layout, Input } from 'antd';
import { Document, Page } from 'react-pdf';
import Pager from '../common/pager';
import BlankImage from '../../img/blank.jpg';
const { Content, Sider } = Layout;
const url = getUrl();

function MailBox(props) {
    const comp = props.componentList;
    const test = comp.map((c, i) => {
        let theComp;
        if (c.pageNumber === props.pageNumber) {
            if (c.type === 'text') {
                theComp = <Input
                    className='sendinput'
                    // onClick={() => props.clickInput(c.id)}
                    id={c.id}
                    style={{ position: 'absolute', left: `${c.left}%`, top: `${c.top}%`, zIndex: 1, height: `${c.height}%`, width: `${c.width}%`, fontSize: '20px' }}
                />;
            } else if (c.type === 'sign') {
                theComp = <img src={BlankImage}
                    className='signBox'
                    id={c.id}
                    alt='blank'
                    style={{ border: '1px solid', borderColor: '#C2C2C2', position: 'absolute', left: `${c.left}%`, top: `${c.top}%`, width: `${c.width}%`, zIndex: 1 }}
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
            url: null,
            numPages: null,
            showPopup: false,
            componentList: [],
            templateId: null
        };
    }

    componentDidMount() {
        getRequest(`/api/template?id=${this.props.match.params.document}`, {})
            .then(response => response.data)
            .then(data => {
                this.setState({
                    url: {
                        url: `${url}/api/file?id=${this.props.match.params.document}`,
                        withCredentials: true
                    }
                });
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
        this.props.history.push(`/platform/edit/${this.props.match.params.document}`);
    }

    backtoHome1 = () => {
        this.props.history.push('/platform');
    }

    clickInput = (id) => {
        console.log(id);
    }

    render() {
        const { url, componentList, templateId, numPages } = this.state;
        const { document } = this.props.match.params;

        return (
            <div className="App">
                <DefaultNavbar />
                <Layout>
                    <Layout style={{ minHeight: '100vh' }}>
                        <Layout>
                            <Content style={{ margin: '24px 20% 10px 20%' }}>
                                <Pages onDocumentLoadSuccess={this.onDocumentLoadSuccess} numPages={numPages} componentList={componentList} url={url} />
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
