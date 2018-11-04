import React, { Component } from 'react';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';
import Sidebar from './common/sidebar';
import { List, Button } from 'antd';

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

    componentDidMount() {
    }

    render() {
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
                                    bordered={true}
                                    itemLayout="horizontal"
                                    dataSource={documents}
                                    renderItem={item => (
                                    <List.Item actions={[<Button className="sgds-button is-rounded is-secondary" onClick={() => this.props.history.push(`${item.title}/edit`)}>View</Button>]}>
                                            <List.Item.Meta
                                                // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
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

export default Job;
