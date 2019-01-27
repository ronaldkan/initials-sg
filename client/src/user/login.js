import React, { Component } from 'react';
import { Form, Input, Icon, Button } from 'antd';
import { postRequest } from '../util/requestUtil'; 
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';

const FormItem = Form.Item;

class Login extends Component {
    constructor() {
        super();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                postRequest('/api/login', values).then(resp => {
                    if (resp.status === 200) {
                        this.props.history.push('/platform');
                    };
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;


        return (
            <div className="App">
                <DefaultNavbar />
                <section className="sgds-section" style={{ backgroundColor:'#F2F2F2' }}>
                    <div className="sgds-container">
                        <div className="row" style={{ minHeight: '60vh' }}>
                            <div className="login-page">
                                <div className="form" style={{ marginBottom: "150px" }}>
                                    <div style={{ marginBottom: 16 }}>
                                        <h3 style={{ color: "#b0a13c" }}>Welcome</h3>
                                    </div>

                                    <Form onSubmit={this.handleSubmit} className="login-form">
                                        <FormItem>
                                            {getFieldDecorator('email', {
                                                rules: [{ required: true, message: 'Please input your Username!' }],
                                            })(
                                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />,
                                            )}
                                        </FormItem>
                                        <FormItem>
                                            {getFieldDecorator('password', {
                                                rules: [{ required: true, message: 'Please input your Password!' }],
                                            })(
                                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />,
                                            )}
                                        </FormItem>
                                        <Button className="sgds-button is-rounded is-medium is-secondary margin--top--lg" type="primary" htmlType="submit" style={{ width: '100%', height: '49.5px' }}>Log in</Button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        );
    }
}

export default (Form.create()(Login));
