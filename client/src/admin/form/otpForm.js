import React, { Component } from 'react';
import { Form, Input, Icon, Button, notification } from 'antd';
import { postRequest } from '../../util/requestUtil';
import axios from 'axios';

const FormItem = Form.Item;
const { TextArea } = Input;

class OtpForm extends Component {
    constructor() {
        super();
        this.state = {};
    }

    goHome = () => {
        this.props.backtoHome();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                values["uuid"] = this.props.uuid;

                postRequest("/api/pin", values).then(response => response.data).then(data => {
                    console.log(data["result"]);
                    if (data["result"] === 1) {
                        this.props.authorized();
                    } else {
                        notification['error']({
                            message: 'PIN is incorrect',
                            description: 'Please enter the correct One-Time PIN.',
                        });
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit} style={{ margin: '20px 20px 20px 20px' }}>
                <FormItem>
                    {getFieldDecorator('pin', {
                        rules: [{ required: true, message: 'Otp is invalid' }],
                    })(
                        <div>
                            <Input id="pin-input" type="number" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="Enter otp" />
                            <p style={{ fontSize: '12px' }}>
                                <i>A one-time pin has been sent to your mobile number. </i>
                                <a>Resend Otp</a>
                            </p>
                        </div>
                    )}
                </FormItem>
                <Button className="sgds-button is-rounded is-secondary" type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '15px' }}>Proceed</Button>
            </Form>
        );
    }
}

export default Form.create()(OtpForm);
