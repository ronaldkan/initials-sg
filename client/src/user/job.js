import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import saveAs from 'file-saver';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';
import Sidebar from './common/sidebar';
import { List, Button, Badge, Card } from 'antd';
import { getRequest, getBlobRequest, putRequest } from '../util/requestUtil';


const documents = [
    {
        "title": "Title1",
        "description": "Description1"
    },
    {
        "title": "Title1",
        "description": "Description1"
    },
    {
        "title": "Title1",
        "description": "Description1"
    }
]
class Job extends Component {

    constructor() {
        super();
        this.state = {
            jobs: []
        };
    }

    componentDidMount() {
        this.getJobs();
    }

    getJobs = () => {
        getRequest('/api/job/all', {})
            .then(response => response.data)
            .then(data => {
                let myData = [];
                data.forEach(element => {
                    var date = moment(element.createdAt).format('YYYY-MM-DD HH:mm');
                    if (element.isSigned || element.isCancelled) {
                        date = moment(element.updatedAt).format('YYYY-MM-DD HH:mm');
                    }
                    myData.push({
                        date: date,
                        element: element
                    });
                });

                this.setState({ jobs: myData });
            });
    }

    download = (uuid) => {
        getBlobRequest(`/api/job/download/${uuid}`).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.zip');
            document.body.appendChild(link);
            link.click();
        });
    }

    cancel = (uuid) => {
        putRequest(`/api/job/cancel/${uuid}`).then(res => {
            this.getJobs();
        });
    }

    render() {
        const { jobs } = this.state;

        return (
            <div className="App">
                <DefaultNavbar />
                <section className="sgds-section">
                    <div className="sgds-container">
                        <div className="row">
                            <div className="col is-3 is-hidden-touch has-side-nav">
                                <Sidebar />
                            </div>
                            <div className="col is-9 is-hidden-touch has-side-nav">
                                <List
                                    grid={{ gutter: 16, column: 3 }}
                                    style={{ backgroundColor: 'FFFFFF' }}
                                    dataSource={jobs}
                                    pagination={{
                                        onChange: (page) => {
                                            console.log(page);
                                        },
                                        pageSize: 9,
                                    }}
                                    renderItem={item => (

                                        item.element.iscancelled ?
                                            <List.Item>
                                                <Card title={item.element.Template.file} extra={<div><Badge style={{ backgroundColor: "#b0a13c" }} count={"Cancelled"} /></div>}>
                                                    <div>{item.element.recipient}<br></br>{item.element.subject}<br></br>{item.date}</div>
                                                </Card>
                                            </List.Item>

                                            :
                                            item.element.iscompleted ?
                                                <List.Item>
                                                    <Card title={item.element.Template.file} extra={<div><Badge style={{ backgroundColor: "#b0a13c" }} count={"Completed"} /> | <a href={`/demo/completed/${item.element.uuid}`} target='_blank'>View</a></div>}>
                                                        <div>{item.element.recipient}<br></br>{item.element.subject}<br></br>{item.date}<br></br><br></br><Button onClick={() => this.download(item.element.uuid)} className="sgds-button is-rounded is-secondary" type="primary">Download</Button></div>
                                                    </Card>
                                                </List.Item>
                                                :
                                                <List.Item>
                                                    <Card title={item.element.Template.file} extra={<Badge count={"Pending"} />}>
                                                        <div>{item.element.recipient}<br></br>{item.element.subject}<br></br>{item.date}<br></br><br></br><Button style={{ backgroundColor: '#f5222d' }} onClick={() => this.cancel(item.element.uuid)} className="sgds-button is-rounded is-secondary" type="primary">Cancel</Button></div>
                                                    </Card>
                                                </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }
}

export default Job;
