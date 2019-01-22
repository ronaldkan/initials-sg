import React, { Component } from 'react';
import { Form, Input, Icon, Button, Alert } from 'antd';
import { postRequest } from '../util/requestUtil'; 
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';

const FormItem = Form.Item;

class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                postRequest('/api/login', values).then(resp => {
                    if (resp.status === 200) {
                        this.props.history.push('/demo');
                    }else {
                        this.setState({
                            error: true
                        });
                    }
                }).catch((e) => 
                {
                    this.setState({
                        error: true
                    });
                  console.error(e);
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { error } = this.state;

        return (
            <div className="App">
            { error ? <Alert showIcon={false} type="error" message="Login Failed" banner /> : '' }
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
                                                <Input prefix={<Icon type="user" style={{ fontSize: '13px' }} />} placeholder="Username" />,
                                            )}
                                        </FormItem>
                                        <FormItem>
                                            {getFieldDecorator('password', {
                                                rules: [{ required: true, message: 'Please input your Password!' }],
                                            })(
                                                <Input prefix={<Icon type="lock" style={{ fontSize: '13px' }} />} type="password" placeholder="Password" />,
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
