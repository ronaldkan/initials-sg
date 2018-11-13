import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import EditForm from '../form/editForm';
import MyPopover from '../common/editPopover';
import axios from 'axios';
import moment from 'moment';

import { Layout, Input, Button, Popover, notification } from 'antd';
import { Document, Page } from 'react-pdf';
import BlankImage from '../../img/blank.jpg';
import Logo from '../../img/logo_sgds.png';
import Navbar from '../common/editNavbar';
import Footer from '../../static/footer';
import { getRequest, getUrl, postRequest } from '../../util/requestUtil';

const { Header, Content, Sider } = Layout;
const ButtonGroup = Button.Group;
const shiftingRatio = 0.5;
const url = getUrl();

function MailBox(props) {
    const comp = props.componentList;
    const test = comp.map((c, i) => {
        let theComp;
        if (c.type === 'text') {
            theComp = <Input
                id={c.id}
                style={{ position: 'absolute', left: `${c.left}%`, top: `${c.top}%`, zIndex: 99, height: `${c.height}%`, width: `${c.width}%` }}
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
                <Popover placement="top" content={
                    <ButtonGroup>
                        <Button onClick={() => props.shiftLeft(c.id, c.type)} size='large' type="primary" icon="left" />
                        <Button onClick={() => props.ShiftUp(c.id, c.type)} size='large' type="primary" icon="up" />
                        <Button onClick={() => props.shiftDown(c.id, c.type)} size='large' type="primary" icon="down" />
                        <Button onClick={() => props.shiftRight(c.id, c.type)} size='large' type="primary" icon="right" />
                        <Button onClick={() => props.componentDelete(c.id)} size='large' type="danger" icon="delete" />
                        <Button onClick={() => props.shorten(c.id, c.type)} size='large' type="danger" icon="minus" />
                        <Button onClick={() => props.lengthen(c.id, c.type)} size='large' type="danger" icon="plus" />
                    </ButtonGroup>
                } trigger="click">
                    {theComp}
                </Popover>
            </div>
        );
    });
    return test;
}


class Edit extends Component {

    constructor() {
        super();
        this.state = {
            pageNumber: 1,
            url: null,
            document: 'sample',
            numPages: null,
            pctX: 0,
            pctY: 0,
            popOverX: 0,
            popOverY: 0,
            showPopup: false,
            componentList: [],
            documentId: null,
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
                this.setState({ componentList: componentList });
            });

    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    addComponent = (id, left, top, type) => {
        let currentList = this.state.componentList;
        if (!id) {
            id = moment().unix();
        }
        var componentJson = {
            id: id,
            left: left,
            top: top,
            width: 10,
            type: type
        };
        if (type === 'text') {
            componentJson['width'] = 15;
            componentJson['height'] = 2
        }
        currentList.push(componentJson);
        this.setState({ componentList: currentList, showPopup: false });
    }

    updateCurrentComponent = (id, left, top, type, width) => {
        let currentList = this.state.componentList;
        currentList.forEach(comp => {
            if (id === comp.id) {
                comp.left = left;
                comp.top = top;
                if (width) {
                    comp.width = width;
                }
            };
        })
        this.setState({ componentList: currentList });
    }

    lengthen = (id, type) => {
        if (!id) {
            return;
        }
        var dom = document.getElementById(id).style;
        var top = parseFloat(dom.top);
        var left = parseFloat(dom.left);
        var width = parseFloat(dom.width) + 1;
        this.updateCurrentComponent(id, left, top, type, width);
    }


    shorten = (id, type) => {
        if (!id) {
            return;
        }
        var dom = document.getElementById(id).style;
        var top = parseFloat(dom.top);
        var left = parseFloat(dom.left);
        var width = parseFloat(dom.width) - 1;
        this.updateCurrentComponent(id, left, top, type, width);
    }


    shiftLeft = (id, type) => {
        if (!id) {
            return;
        }
        var dom = document.getElementById(id).style;
        var top = parseFloat(dom.top);
        var left = parseFloat(dom.left) - shiftingRatio;
        this.updateCurrentComponent(id, left, top, type);
    }

    shiftRight = (id, type) => {
        if (!id) {
            return;
        }
        var dom = document.getElementById(id).style;
        var top = parseFloat(dom.top);
        var left = parseFloat(dom.left) + shiftingRatio;
        this.updateCurrentComponent(id, left, top, type);
    }

    ShiftUp = (id, type) => {
        if (!id) {
            return;
        }
        var dom = document.getElementById(id).style;
        var top = parseFloat(dom.top) - shiftingRatio;
        var left = parseFloat(dom.left);
        this.updateCurrentComponent(id, left, top, type);
    }

    shiftDown = (id, type) => {
        console.log('hello');
        if (!id) {
            return;
        }
        var dom = document.getElementById(id).style;
        var top = parseFloat(dom.top) + shiftingRatio;
        var left = parseFloat(dom.left);
        this.updateCurrentComponent(id, left, top, type);
    }

    componentDelete = (id) => {
        let currentList = this.state.componentList;
        let newList = [];
        currentList.forEach(comp => {
            if (id !== comp.id) {
                newList.push(comp);
            };
        })
        this.setState({ componentList: newList });
    }

    onItemClick = (e) => {
        var doc = ReactDOM.findDOMNode(this.refs['abc']);
        var docPosition = doc.getBoundingClientRect();
        var pctX = (e.pageX - docPosition.x) / doc.clientWidth * 100;
        var pctY = ((e.clientY - docPosition.top) / doc.clientHeight * 100);
        this.setState({ popOverX: pctX + 1, popOverY: pctY - 2, pctX: pctX, pctY: pctY - 1 });
        if (e.target.classList.contains('ant-btn') ||
            e.target.classList.contains('ant-input') ||
            e.target.classList.contains('anticon') ||
            e.target.classList.contains('signBox') ||
            e.target.classList.contains('ant-popover-inner-content')) {
            this.setState({ showPopup: false });
            return;
        }
        this.setState({ showPopup: true });
    }

    addTextField = () => {
        this.addComponent('', this.state.pctX, this.state.pctY, 'text');
    }

    addSignField = () => {
        this.addComponent('', this.state.pctX, this.state.pctY, 'sign');
    }

    cancelPopUp = () => {
        this.setState({ showPopup: false });
    }

    backtoHome = () => {
        this.props.history.push('/');
    }

    saveTemplate = () => {
        var nextUrl = `/demo/view/${this.props.match.params.document}`;
        var historyProp = this.props.history;
        postRequest('/api/save', {
            components: JSON.stringify(this.state.componentList),
            filename: this.props.match.params.document
        })
            .then(function (response) {
                historyProp.push(nextUrl);
                notification['success']({
                    message: 'Save successful!',
                    description: 'Current template has been updated!',
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        const { pageNumber, url, popOverX, popOverY, showPopup, componentList } = this.state;

        return (
            <div className="App">
                <Navbar saveTemplate={this.saveTemplate} />
                <Layout>
                    <Content style={{ margin: '24px 20% 50px 20%' }}>
                        <Document
                            className='mydoc'
                            ref='abc'
                            file={url}
                            onClick={this.onItemClick}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                        >
                            <MailBox componentList={componentList} shiftLeft={this.shiftLeft} ShiftUp={this.ShiftUp} shiftDown={this.shiftDown} shiftRight={this.shiftRight} componentDelete={this.componentDelete} shorten={this.shorten} lengthen={this.lengthen} />
                            {showPopup ?
                                <MyPopover
                                    popOverX={popOverX}
                                    popOverY={popOverY}
                                    addTextField={this.addTextField}
                                    cancelPopUp={this.cancelPopUp}
                                    addSignField={this.addSignField}
                                /> : null}
                            <Page renderAnnotations={false} renderMode={"svg"} renderTextLayer={false} pageNumber={pageNumber} scale={1} />
                        </Document>
                    </Content>
                </Layout>
                <Footer />
            </div>
        );
    }
}

export default Edit;
