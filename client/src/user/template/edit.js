import React, { Component } from 'react';
import moment from 'moment';
import { Layout, notification } from 'antd';
import Navbar from '../common/editNavbar';
import Footer from '../../static/footer';
import Pager from '../common/pager';
import { getRequest, getUrl, postRequest } from '../../util/requestUtil';

const { Content } = Layout;
const shiftingRatio = 0.5;
const url = getUrl();


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
            currentPageNumber: 1
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
            type: type,
            pageNumber: this.state.currentPageNumber
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
        var doc = e.target.parentElement.parentNode;
        var docPosition = doc.getBoundingClientRect();
        var pctX = (e.pageX - docPosition.x) / doc.clientWidth * 100;
        var pctY = ((e.clientY - docPosition.top) / doc.clientHeight * 100);
        this.setState({ popOverX: pctX + 1, popOverY: pctY - 2, pctX: pctX, pctY: pctY - 1, currentPageNumber: e.target.parentElement.dataset['pageNumber'] });
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
        var nextUrl = `/platform/view/${this.props.match.params.document}`;
        var historyProp = this.props.history;
        postRequest('/api/save', {
            components: JSON.stringify(this.state.componentList),
            id: this.props.match.params.document
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

        const { url, popOverX, popOverY, showPopup, componentList, numPages } = this.state;
        return (
            <div className="App">
                <Navbar saveTemplate={this.saveTemplate} />
                <Layout>
                    <Content style={{ margin: '24px 20% 50px 20%' }}>
                        <Pager 
                            showPopup={showPopup}
                            onDocumentLoadSuccess={this.onDocumentLoadSuccess} 
                            url={url} 
                            onItemClick={this.onItemClick} 
                            popOverX={popOverX} 
                            popOverY={popOverY} 
                            addTextField={this.addTextField} 
                            cancelPopUp={this.cancelPopUp} 
                            addSignField={this.addSignField}
                            componentList={componentList}
                            ShiftUp={this.ShiftUp}
                            shiftLeft={this.shiftLeft}
                            shiftRight={this.shiftRight}
                            shiftDown={this.shiftDown}
                            numPages={numPages}
                            componentDelete={this.componentDelete}
                            lengthen={this.lengthen}
                            shorten={this.shorten}
                            />
                    </Content>
                </Layout>
                <Footer />
            </div>
        );
    }
}

export default Edit;
