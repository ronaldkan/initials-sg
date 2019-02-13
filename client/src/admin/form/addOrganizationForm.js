import React, { Component } from 'react';
import { Form, Input, Button, notification, Icon } from 'antd';
import { postRequest } from '../../util/requestUtil';

const FormItem = Form.Item;

class AddOrganizationForm extends Component {
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
                postRequest('/api/admin_organization', values).then(data => {
                    this.props.form.resetFields();
                    this.setState({ loading: false });
                    notification.open({
                        message: 'Success!',
                        description: 'A New Org been added!',
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
                    description: 'Add org failed!',
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
            <Form id='addOrgForm' onSubmit={this.handleSubmit} style={{ margin: '0px 20px 20px 20px' }}>
                <Form.Item
                 label="Name"
                 labelCol={{ span: 5 }}
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Name is required' }],
                        intialValue:  "",
                    })(
                        <Input placeholder="Set name for organzation" />
                    )}
                </Form.Item>
                <Form.Item
                label="Description"
                labelCol={{ span: 5 }}
                >
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: 'Description is required' }],
                        intialValue:  "",
                    })(
                        <Input placeholder="Set description for organization" />
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

export default Form.create()(AddOrganizationForm);