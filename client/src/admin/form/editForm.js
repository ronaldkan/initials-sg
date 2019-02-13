import React, { Component } from 'react';
import { Form, Input, Icon, Button, notification } from 'antd';
import { getRequest } from '../../util/requestUtil';
import axios from 'axios';

const FormItem = Form.Item;
const { TextArea } = Input;

class EditForm extends Component {
    constructor() {
        super();
        this.state = {};
    }

    goHome = () => {
        this.props.backtoHome();
    }

    handleSubmit = (e) => {
        var templateId = this.props.templateId;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var data = {};
                var list = document.getElementsByClassName('sendinput');
                for (var i = 0; i < list.length; i++) {
                    if (list[i].value !== "") {
                        data[list[i].id] = list[i].value;
                    }
                }
                values["TemplateId"] = templateId;
                values["data"] = JSON.stringify(data);
                getRequest("/api/send", values).then(response => response)
                    .then(data => {
                        notification['success']({
                            message: 'Email sent!',
                            description: 'Document signing request have been sent!',
                        });
                        this.props.backtoHome();
                    });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { saveTemplate } = this.props;

        return (
            <Form onSubmit={this.handleSubmit} style={{ margin: '20px 20px 20px 20px' }}>
                <FormItem label="Recipient Email">
                    {getFieldDecorator('to', {
                        rules: [{ required: true, message: 'Please enter a valid Email Address' }],
                    })(
                        <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="initials@initials.sg" />,
                    )}
                </FormItem>
                <FormItem label="Phone Number (secure mode)">
                    {getFieldDecorator('phone', )(
                        <Input addonBefore="+65" />,
                    )}
                </FormItem>
                <FormItem label="Recipient Name">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: "Please enter the recipient's name" }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="" />,
                    )}
                </FormItem>
                <FormItem label="Subject">
                    {getFieldDecorator('subject', {
                        rules: [{ required: true, message: 'Please enter a email subject' }],
                    })(
                        <Input prefix={<Icon type="edit" style={{ fontSize: 13 }} />} placeholder="Subject" />,
                    )}
                </FormItem>
                <FormItem label="Email Message">
                    {getFieldDecorator('message', {
                        rules: [{ required: true, message: 'Please enter a email message' }],
                    })(
                        <TextArea rows={4} />,
                    )}
                </FormItem>
                <Button className="sgds-button is-rounded is-secondary" type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '15px' }}>Send</Button>
                <Button className="sgds-button is-rounded is-secondary" onClick={saveTemplate} type="primary" style={{ width: '100%' }}>Edit Template</Button>
                {/* <hr></hr>
                <Button onClick={() => this.goHome()} type="primary" style={{ width: '100%' }}>Back</Button> */}
            </Form>
        );
    }
}

export default Form.create()(EditForm);
