import React, { Component } from 'react';
import { Form, Spin, Input, Icon, Button } from 'antd';
import DefaultNavbar from '../static/defaultNavbar';
import Footer from '../static/footer';

const FormItem = Form.Item;

class Login extends Component {
    constructor() {
        super();
    }

    componentWillMount() {
        document.body.style.backgroundColor = "#F2F2F2";
    }
    componentWillUnmount() {
        document.body.style.backgroundColor = "#FFFFFF";
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.history.push('/demo');
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;


        return (
            <div className="App">
                <DefaultNavbar />
                <section className="sgds-section">
                    <div className="sgds-container">
                        <div className="row">
                            <div className="login-page">
                                <div className="form" style={{ marginBottom: "150px" }}>
                                    <div style={{ marginBottom: 16 }}>
                                        <h3 style={{ color: "#b0a13c" }}>Welcome</h3>
                                    </div>

                                    <Form onSubmit={this.handleSubmit} className="login-form">
                                        <FormItem>
                                            {getFieldDecorator('email', {
                                                rules: [{ required: true, message: 'Please input your Email!' }],
                                            })(
                                                <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="Email" />,
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
