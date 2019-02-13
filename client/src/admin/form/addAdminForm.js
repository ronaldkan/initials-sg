import React, { Component } from 'react';
import { Form, Input, Button, notification, Icon } from 'antd';
import { postRequest } from '../../util/requestUtil';
import { truncate } from 'fs';

const FormItem = Form.Item;

class AddAdminForm extends Component {
    constructor() {
        super();
        this.state = { loading: false };
    }

    handleSubmit = (e) => {
        const { closeModal } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                postRequest('/api/admin', values).then(data => {
                    this.props.form.resetFields();
                    this.setState({ loading: false });
                    notification.open({
                        message: 'Success!',
                        description: 'A New Admin been added!',
                        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                      });
                    closeModal();
                }).catch((e) => 
                {
                    this.setState({
                        loading: false
                    });
                  console.error(e);
                  notification.open({
                    message: 'Failure!',
                    description: 'Add admin failed!',
                    icon: <Icon type="frown" style={{ color: 'red' }} />,
                  });
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.state;

        return (
            <Form id='addAdminPasswordForm' onSubmit={this.handleSubmit} style={{ margin: '0px 20px 20px 20px' }}>
                <Form.Item
                 label="Username"
                 labelCol={{ span: 5 }}
                >
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'user name is required' }],
                        intialValue:  "",
                    })(
                        <Input placeholder="A New Admin" />
                    )}
                </Form.Item>
                <Form.Item
                label="Password"
                labelCol={{ span: 5 }}
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'password is required' }],
                        intialValue:  "",
                    })(
                        <Input type="password" placeholder="A New Password" />
                    )}
                </Form.Item>
                <Button  
                type="primary" 
                htmlType="submit" 
                style={{ width: '100%', marginBottom: '15px' }}
                loading={loading}
                >Add</Button>
            </Form>
        );
    }
}

export default Form.create()(AddAdminForm);