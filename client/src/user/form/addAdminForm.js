import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { postRequest } from '../../util/requestUtil';

const FormItem = Form.Item;

class AddAdminForm extends Component {
    constructor() {
        super();
        this.state = {};
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['OrganizationId'] = 1;
                postRequest('/api/user', values).then(data => {
                    document.getElementById("addPasswordForm").reset();
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form id='addPasswordForm' onSubmit={this.handleSubmit} style={{ margin: '20px 20px 20px 20px' }}>
                <FormItem>
                    {getFieldDecorator('firstname', {
                        rules: [{ required: true, message: 'First name is required' }],
                    })(
                        <div>
                            <Input placeholder="First Name" />
                        </div>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('lastname', {
                        rules: [{ required: true, message: 'Last name is required' }],
                    })(
                        <div>
                            <Input placeholder="Last Name" />
                        </div>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: 'Email is required' }],
                    })(
                        <div>
                            <Input  placeholder="Email" />
                        </div>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'password is required' }],
                    })(
                        <div>
                            <Input type="password" placeholder="Password" />
                        </div>
                    )}
                </FormItem>
                <Button  type="primary" htmlType="submit" style={{ width: '100%', marginBottom: '15px' }}>Add</Button>
            </Form>
        );
    }
}

export default Form.create()(AddAdminForm);