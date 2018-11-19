import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';
import Sidebar from './common/sidebar';
import { List, Button, Badge, Card } from 'antd';
import { getRequest } from '../util/requestUtil';

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
                                        item.element.iscompleted ?
                                            <List.Item>
                                                <Card title={item.element.Template.file} extra={<div><Badge style={{ backgroundColor: "#b0a13c" }} count={"Completed"} /> | <a href={`/demo/completed/${item.element.uuid}`} target='_blank'>View</a></div>}>
                                                    <div>{item.element.recipient}<br></br>{item.element.subject}<br></br>{item.element.message}<br></br>{item.date}<br></br><br></br><Button className="sgds-button is-rounded is-secondary" type="primary">Download</Button></div>
                                                </Card>
                                            </List.Item>
                                            :
                                            <List.Item>
                                                <Card title={item.element.Template.file} extra={<Badge count={"Pending"} />}>
                                                    <div>{item.element.recipient}<br></br>{item.element.subject}<br></br>{item.element.message}<br></br>{item.date}<br></br><br></br><Button style={{ backgroundColor: '#f5222d' }} className="sgds-button is-rounded is-secondary" type="primary">Cancel</Button></div>
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
