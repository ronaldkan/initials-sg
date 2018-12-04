import React, { Component } from 'react';
import axios from 'axios';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';
import OtpForm from './form/otpForm';

import jspdf from 'jspdf';
import { Layout, Input, Button, notification, Modal, Row } from 'antd';
import { Document, Page } from 'react-pdf';
import html2canvas from 'html2canvas';
import { SketchField, Tools } from 'react-sketch';
import BlankImage from '../img/blank.jpg';
import { getRequest, getUrl, putRequest } from '../util/requestUtil';

const { Content } = Layout;
const url = getUrl();

function MailBox(props) {
    const comp = props.componentList;
    const test = comp.map((c, i) => {
        let theComp;
        if (c.type === 'text' && !c.value) {
            theComp = <Input
                id={c.id}
                style={{ position: 'absolute', left: `${c.left}%`, top: `${c.top}%`, zIndex: 99, height: `${c.height}%`, width: `${c.width}%`, fontSize: '20px' }}
            />;
        } else if (c.type === 'text' && c.value) {
            theComp = <Input
                readOnly
                className="completedInput"
                id={c.id}
                value={c.value}
                style={{ position: 'absolute', left: `${c.left}%`, top: `${c.top}%`, zIndex: 99, height: `${c.height}%`, width: `${c.width}%`, fontSize: '20px' }}
            />;
        } else if (c.type === 'sign') {
            theComp = <img src={BlankImage}
                className='signBox'
                onClick={props.clickMe}
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


class Sign extends Component {

    constructor() {
        super();
        this.state = {
            pageNumber: 1,
            url: false,
            numPages: null,
            showPopup: false,
            componentList: [],
            templateId: null,
            recipient: null,
            authorized: false,
            secured: false,
            uuid : null
        };
    }

    componentDidMount() {
        getRequest(`/api/sign/${this.props.match.params.uuid}`, {})
            .then(response => response.data)
            .then(data => {
                if (!data) {
                    setTimeout(
                        function () {
                            this.props.history.push('/');
                        }
                            .bind(this),
                        5000
                    );
                    return;
                }
                this.setState({ url: `${url}/api/file?fileName=${data.Template.file}`, recipient: data.recipient, file: data.Template.file });
                if (!data.Template) {
                    return;
                }
                if (data.phone) {
                    this.setState({ secured: true, uuid: this.props.match.params.uuid });
                }
                let componentList = JSON.parse(data.Template.component);
                let dataList = JSON.parse(data.data);
                var list = document.getElementsByClassName('ant-input');
                for (var i = 0; i < componentList.length; i++) {
                    if (dataList.hasOwnProperty(componentList[i].id)) {
                        componentList[i].value = dataList[componentList[i].id];
                    }
                }
                this.setState({ componentList: componentList });
            });

    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    save = () => {
        var data = [];
        var list = document.getElementsByClassName('ant-input');
        for (var i = 0; i < list.length; i++) {
            data.push({
                id: list[i].value,
                value: list[i].value,
                left: list[i].style.left,
                top: list[i].style.top,
                width: list[i].style.width
            });
            if (list[i].value === "") {
                notification['error']({
                    message: 'Incomplete document!',
                    description: 'Please fill up all the fields required for the document to be complete!',
                });
                return;
            }
        }
        var list2 = document.getElementsByClassName('signBox');
        for (var i = 0; i < list2.length; i++) {
            data.push({
                id: list2[i].id,
                src: list2[i].src,
                left: list2[i].style.left,
                top: list2[i].style.top,
                width: list2[i].style.width
            });
        }
        var params = {
            "uuid": this.props.match.params.uuid,
            "data": JSON.stringify(data),
            recipient: this.state.recipient,
            file: this.state.file
        }
        putRequest('/api/job', params).then(data => {
            this.props.history.push('/demo/complete');
        });
    }

    handleOk = (e) => {
        document.getElementsByClassName("signBox")[0].src = this._sketch.toDataURL();
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    onClear = () => {
        this._sketch.clear();
    }


    clickMe = () => {
        this.setState({
            visible: true,
        });
    }

    makeAuthorized = () => {
        this.setState({
            authorized: true
        })
    }


    render() {
        const { pageNumber, url, componentList, authorized, secured, uuid } = this.state;

        return (
            <div className="App">
                <DefaultNavbar />
                <Layout>
                    <Content style={{ margin: '24px 20% 50px 20%' }}>

                        {
                            authorized ?
                                <div>
                                    {
                                        url ?
                                            <div>
                                                <Document
                                                    className='mydoc'
                                                    ref='abc'
                                                    file={url}
                                                    onClick={this.onItemClick}
                                                    onLoadSuccess={this.onDocumentLoadSuccess}
                                                >
                                                    <MailBox componentList={componentList} clickMe={this.clickMe} />
                                                    <Page renderAnnotations={false} renderTextLayer={false} pageNumber={pageNumber} scale={1} />
                                                </Document>
                                                <Button onClick={() => this.save()} className="sgds-button is-rounded is-medium is-secondary margin--top--lg" type="primary" htmlType="submit" style={{ width: '100%', height: '49.5px' }}>Submit</Button>
                                            </div> :
                                            <div class="row" style={{ minHeight: '60vh', marginTop: '25px' }}>
                                                <div class="col is-half is-offset-one-quarter">
                                                    <div class="content has-text-centered">
                                                        <h3>Where is this place?</h3>
                                                        <p>You have reached a unknown page. You will be redirected to the home page.</p>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                    <Modal
                                        title="Please sign"
                                        visible={this.state.visible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                    >
                                        <SketchField
                                            ref={(c) => this._sketch = c}
                                            width='100%'
                                            height='280px'
                                            tool={Tools.Pencil}
                                            lineColor='black'
                                            lineWidth={3} />
                                        <Row>
                                            <Button onClick={this.onClear} style={{ marginRight: '10px', marginTop: '10px' }} type='primary'>Clear</Button>
                                        </Row>
                                    </Modal>
                                </div> :
                                <div class="sgds-card">
                                    <div class="row" style={{ minHeight: '60vh', marginTop: '25px' }}>
                                        <div class="col is-half is-offset-one-quarter">
                                            <div class="content has-text-centered" style={{ marginTop: '14vh' }}>
                                                <p>By proceeding, you are acknowledging as the right recipient of the intended document.</p>
                                                {
                                                    secured ?
                                                        <OtpForm uuid={uuid} authorized={() => this.makeAuthorized()} /> :
                                                        <Button onClick={() => this.makeAuthorized()} className="sgds-button is-rounded is-secondary" type="primary" style={{ width: '100%', marginBottom: '15px', marginTop: '15px' }}>Proceed</Button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                    </Content>
                </Layout>
                <Footer />
            </div>
        );
    }
}

export default Sign;
