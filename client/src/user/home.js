import React, { Component } from 'react';
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
                        id: element.id,
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
            withCredentials:true,
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
        // this.props.history.push('/demo/home');
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
                                <Upload {...props} style={{ marginBottom: '15px' }}>
                                    <Button>
                                        <Icon type="upload" /> Upload
                                    </Button>
                                </Upload>
                                <List
                                    bordered={true}
                                    itemLayout="horizontal"
                                    dataSource={documents}
                                    renderItem={item => (
                                        <List.Item actions={[<Button className="sgds-button is-rounded is-secondary" onClick={() => this.props.history.push(`demo/view/${item.id}`)}>View</Button>]}>
                                            <List.Item.Meta
                                                title={item.title}
                                                description={item.description}
                                            />
                                        </List.Item>
                                    )} />
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
