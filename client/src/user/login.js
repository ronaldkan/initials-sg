import React, { Component } from 'react';
import { Form, Spin, Input, Icon, Button } from 'antd';

const FormItem = Form.Item;

class Login extends Component {
    constructor() {
        super();
        this.state = { isLoading: false };
    }

    componentWillMount() {
        document.body.classList.add('login-background');
    }
    componentWillUnmount() {
        document.body.classList.remove('login-background');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });
                this.props.adminLogin(values.email, values.password)
                    .then((reduxResponse) => {
                        const success = reduxResponse.payload;
                        if (success) {
                            // window.location.href = this.props.match.path.replace('login', '');
                            this.props.history.push('/admin/');
                        } else {
                            this.setState({ isLoading: false });
                        }
                    })
                    .catch(() => this.setState({ isLoading: false }));
            }
        });
    }

    render() {
        const { isLoading } = this.state;
        const { getFieldDecorator } = this.props.form;


        return (
            <div className="login-page">
                <Spin spinning={isLoading} tip="Logging in...">
                    <div className="form" style={{ marginBottom: 0 }}>
                        <div style={{ marginBottom: 16 }}>
                            <h3>Welcome</h3>
                        </div>

                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: 'Please input your email!' }],
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
                            <Button type="primary" htmlType="submit" style={{ width: 240 }}>Log in</Button>
                        </Form>
                    </div>
                </Spin>
            </div>

        );
    }
}

export default (Form.create()(Login));
